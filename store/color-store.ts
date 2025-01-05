import { create } from 'zustand';

// 辅助函数：将 RGB 转换为十六进制
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return `${hex.length === 1 ? `0${hex}` : hex}`;  // 修复字符串连接的 linter 错误
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// 初始颜色使用十六进制格式
const initialColors = {
  from: '#ff0000',  // 红色
  to: '#00ff00'     // 绿色
};

interface ColorStore {
  bgColorFrom: string;
  bgColorTo: string;
  setBgColors: (from: string, to: string) => void;
}

export const useColorStore = create<ColorStore>((set) => ({
  bgColorFrom: initialColors.from,
  bgColorTo: initialColors.to,
  setBgColors: (from, to) => set({ bgColorFrom: from, bgColorTo: to }),
})); 