import os
import json
import numpy as np
from PIL import Image, ImageOps

INPUT_IMAGE = 'assets/images/color.jpg'
OUTPUT_DIR = 'assets/images/hair_color_samples'
REPORT_FILE = 'hair_colors_report.json'

def detect_lines(projection, threshold_factor=0.9, min_distance=10):
    """
    Detects indices where the projection value is high (indicating a white line).
    """
    # Normalize projection
    max_val = np.max(projection)
    threshold = max_val * threshold_factor
    
    # Find indices above threshold
    indices = np.where(projection > threshold)[0]
    
    # Group indices to find line centers
    lines = []
    if len(indices) == 0:
        return lines
        
    current_group = [indices[0]]
    for i in range(1, len(indices)):
        if indices[i] - indices[i-1] < min_distance:
            current_group.append(indices[i])
        else:
            lines.append(int(np.mean(current_group)))
            current_group = [indices[i]]
    lines.append(int(np.mean(current_group)))
    
    return lines

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"Loading {INPUT_IMAGE}...")
    try:
        img = Image.open(INPUT_IMAGE)
    except Exception as e:
        print(f"Error loading image: {e}")
        return

    # Convert to grayscale for analysis
    gray_img = ImageOps.grayscale(img)
    img_array = np.array(gray_img)
    
    height, width = img_array.shape
    print(f"Image dimensions: {width}x{height}")
    
    # Compute projections (average brightness along rows and cols)
    row_proj = np.mean(img_array, axis=1)
    col_proj = np.mean(img_array, axis=0)
    
    # Detect horizontal lines (rows)
    # We expect roughly 9 lines (top, bottom, and 7 dividers for 8 rows)
    # Adjust threshold until we get a reasonable number of lines
    h_lines = detect_lines(row_proj, threshold_factor=0.95, min_distance=20)
    
    # Detect vertical lines (cols)
    # We expect roughly 6 lines (left, right, and 4 dividers for 5 cols)
    v_lines = detect_lines(col_proj, threshold_factor=0.95, min_distance=20)
    
    print(f"Detected {len(h_lines)} horizontal lines and {len(v_lines)} vertical lines.")
    
    # Fallback if detection fails significantly (e.g. not enough lines to form a grid)
    # We expect at least enough lines to form boundaries.
    # If we have too few, we might need to assume equal spacing.
    
    # Add start and end if missing
    if not h_lines or h_lines[0] > 50:
        h_lines.insert(0, 0)
    if not h_lines or h_lines[-1] < height - 50:
        h_lines.append(height)
        
    if not v_lines or v_lines[0] > 50:
        v_lines.insert(0, 0)
    if not v_lines or v_lines[-1] < width - 50:
        v_lines.append(width)
        
    # Sort just in case
    h_lines.sort()
    v_lines.sort()
    
    # Process cells
    extracted_colors = []
    count = 1
    
    # Define a margin to crop inside the grid lines to avoid white borders
    margin = 5
    
    for i in range(len(h_lines) - 1):
        for j in range(len(v_lines) - 1):
            y1 = h_lines[i] + margin
            y2 = h_lines[i+1] - margin
            x1 = v_lines[j] + margin
            x2 = v_lines[j+1] - margin
            
            # Skip invalid crops
            if y2 <= y1 or x2 <= x1:
                continue
                
            # Crop
            cell = img.crop((x1, y1, x2, y2))
            
            # Check if cell is mostly empty/white (e.g. bottom right corner might be empty)
            # Simple check: calculate variance or mean brightness
            cell_gray = ImageOps.grayscale(cell)
            cell_arr = np.array(cell_gray)
            if np.mean(cell_arr) > 240: # Very bright, likely white space
                print(f"Skipping cell {i},{j} (likely empty)")
                continue
            
            filename = f"color_{count:02d}.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            # Save as JPEG with high quality
            cell.save(filepath, "JPEG", quality=90, subsampling=0)
            
            extracted_colors.append({
                "id": count,
                "filename": filename,
                "row": i + 1,
                "col": j + 1,
                "width": x2 - x1,
                "height": y2 - y1
            })
            
            count += 1
            
    # Generate report
    with open(REPORT_FILE, 'w') as f:
        json.dump(extracted_colors, f, indent=2)
        
    print(f"Successfully extracted {len(extracted_colors)} hair color samples.")
    print(f"Report saved to {REPORT_FILE}")

if __name__ == "__main__":
    main()
