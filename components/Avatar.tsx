import React from 'react';
import Svg, { Ellipse, Path, Rect, Circle } from 'react-native-svg';

interface AvatarProps {
  shoulderWidth?: number;
  bust?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  skinTone?: string;
  topColor?: string;
  bottomColor?: string;
  shoeColor?: string;
  height?: number;
}

export default function Avatar({
  shoulderWidth = 42,
  bust = 90,
  waist = 72,
  hips = 96,
  inseam = 78,
  skinTone = '#D4A06A',
  topColor,
  bottomColor,
  shoeColor,
  height = 280,
}: AvatarProps) {
  const svgW = 160;
  const svgH = height;
  const cx = svgW / 2;

  const maxWidth = svgW * 0.7;
  const refMax = Math.max(shoulderWidth, bust, hips, 46);
  const scale = maxWidth / refMax;

  const sW = (shoulderWidth * scale) / 2;
  const bW = (bust * scale) / 2;
  const wW = (waist * scale) / 2;
  const hW = (hips * scale) / 2;

  const headR = 16;
  const neckLen = 8;
  const headTop = 20;
  const headCy = headTop + headR;
  const neckBot = headCy + headR + neckLen;

  const torsoTop = neckBot;
  const torsoH = svgH * 0.28;
  const waistY = torsoTop + torsoH * 0.55;
  const torsoBot = torsoTop + torsoH;

  const inseamScale = Math.min(inseam / 78, 1.2);
  const legH = svgH * 0.32 * inseamScale;
  const legBot = torsoBot + legH;
  const kneeY = torsoBot + legH * 0.5;

  const armLen = torsoH * 0.9;
  const armTop = torsoTop + 4;
  const armBot = armTop + armLen;

  const torsoSkin = skinTone;
  const torsoFill = topColor || torsoSkin;
  const legFill = bottomColor || torsoSkin;
  const footFill = shoeColor || '#3D2B1F';

  const torsoPath = `
    M ${cx - sW} ${torsoTop}
    Q ${cx - bW} ${torsoTop + torsoH * 0.25}, ${cx - wW} ${waistY}
    Q ${cx - hW * 0.95} ${torsoBot - 4}, ${cx - hW} ${torsoBot}
    L ${cx + hW} ${torsoBot}
    Q ${cx + hW * 0.95} ${torsoBot - 4}, ${cx + wW} ${waistY}
    Q ${cx + bW} ${torsoTop + torsoH * 0.25}, ${cx + sW} ${torsoTop}
    Z
  `;

  const legGap = 4;
  const leftLegPath = `
    M ${cx - hW} ${torsoBot}
    L ${cx - legGap} ${torsoBot}
    L ${cx - legGap - 2} ${kneeY}
    L ${cx - legGap - 1} ${legBot}
    L ${cx - hW * 0.5} ${legBot}
    L ${cx - hW * 0.6} ${kneeY}
    Z
  `;
  const rightLegPath = `
    M ${cx + hW} ${torsoBot}
    L ${cx + legGap} ${torsoBot}
    L ${cx + legGap + 2} ${kneeY}
    L ${cx + legGap + 1} ${legBot}
    L ${cx + hW * 0.5} ${legBot}
    L ${cx + hW * 0.6} ${kneeY}
    Z
  `;

  const leftArmPath = `
    M ${cx - sW} ${armTop}
    Q ${cx - sW - 10} ${armTop + armLen * 0.5}, ${cx - sW - 6} ${armBot}
    L ${cx - sW - 2} ${armBot}
    Q ${cx - sW - 6} ${armTop + armLen * 0.5}, ${cx - sW + 4} ${armTop}
    Z
  `;
  const rightArmPath = `
    M ${cx + sW} ${armTop}
    Q ${cx + sW + 10} ${armTop + armLen * 0.5}, ${cx + sW + 6} ${armBot}
    L ${cx + sW + 2} ${armBot}
    Q ${cx + sW + 6} ${armTop + armLen * 0.5}, ${cx + sW - 4} ${armTop}
    Z
  `;

  const footW = 10;
  const footH = 6;

  return (
    <Svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
      <Circle cx={cx} cy={headCy} r={headR} fill={skinTone} />
      <Ellipse cx={cx} cy={headCy - 6} rx={headR - 2} ry={8} fill="rgba(0,0,0,0.08)" />
      <Rect x={cx - 4} y={headCy + headR} width={8} height={neckLen} rx={3} fill={skinTone} />

      <Path d={torsoPath} fill={torsoFill} />
      {topColor && (
        <Path d={torsoPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
      )}

      <Path d={leftArmPath} fill={skinTone} />
      <Path d={rightArmPath} fill={skinTone} />
      <Circle cx={cx - sW - 4} cy={armBot + 2} r={4} fill={skinTone} />
      <Circle cx={cx + sW + 4} cy={armBot + 2} r={4} fill={skinTone} />

      <Path d={leftLegPath} fill={legFill} />
      <Path d={rightLegPath} fill={legFill} />
      {bottomColor && (
        <>
          <Path d={leftLegPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
          <Path d={rightLegPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        </>
      )}

      <Ellipse cx={cx - legGap - 1 - footW / 2 + 3} cy={legBot + footH / 2} rx={footW} ry={footH} fill={footFill} />
      <Ellipse cx={cx + legGap + 1 + footW / 2 - 3} cy={legBot + footH / 2} rx={footW} ry={footH} fill={footFill} />
    </Svg>
  );
}
