import React from 'react';
import {
  Stethoscope,
  Heart,
  Sparkles,
  Baby,
  Activity,
  Bone,
  Scan,
  Ribbon,
  Ear,
  Brain,
  Droplets,
  HeartHandshake,
  LayoutGrid
} from 'lucide-react';
import { AdminDepartment } from '../../../types';

interface DepartmentIconProps {
  type: AdminDepartment['iconType'] | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  bgTint?: string;
  iconColor?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({
  type,
  className = '',
  size = 'md',
  bgTint,
  iconColor,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'stethoscope':
        return <Stethoscope className="w-5 h-5 stroke-[2]" />;
      case 'heart':
        return <Heart className="w-5 h-5 stroke-[2] fill-current/10" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 stroke-[2]" />;
      case 'baby':
        return <Baby className="w-5 h-5 stroke-[2]" />;
      case 'female':
        return <HeartHandshake className="w-5 h-5 stroke-[2]" />;
      case 'bone':
        return <Bone className="w-5 h-5 stroke-[2]" />;
      case 'scan':
        return <Scan className="w-5 h-5 stroke-[2]" />;
      case 'ribbon':
        return <Ribbon className="w-5 h-5 stroke-[2]" />;
      case 'ear':
        return <Ear className="w-5 h-5 stroke-[2]" />;
      case 'urology':
        return <Droplets className="w-5 h-5 stroke-[2]" />;
      case 'stomach':
        return <Activity className="w-5 h-5 stroke-[2]" />;
      case 'brain':
        return <Brain className="w-5 h-5 stroke-[2]" />;
      default:
        return <LayoutGrid className="w-5 h-5 stroke-[2]" />;
    }
  };

  const getDefaultColors = () => {
    switch (type) {
      case 'stethoscope':
        return { bg: '#EAF4FF', color: '#0878F9' };
      case 'heart':
        return { bg: '#FEECEE', color: '#EF4444' };
      case 'sparkles':
        return { bg: '#F3EEFD', color: '#8B5CF6' };
      case 'baby':
        return { bg: '#EAF8F0', color: '#10B981' };
      case 'female':
        return { bg: '#FDF0F6', color: '#EC4899' };
      case 'bone':
        return { bg: '#E8F4FD', color: '#0284C7' };
      case 'scan':
        return { bg: '#F3EEFD', color: '#7C3AED' };
      case 'ribbon':
        return { bg: '#FFF3E6', color: '#F97316' };
      case 'ear':
        return { bg: '#E6FAFA', color: '#06B6D4' };
      case 'urology':
        return { bg: '#F3EEFD', color: '#8B5CF6' };
      case 'stomach':
        return { bg: '#E8FAF7', color: '#0D9488' };
      case 'brain':
        return { bg: '#F3EEFD', color: '#7C3AED' };
      default:
        return { bg: '#EAF4FF', color: '#0878F9' };
    }
  };

  const colors = {
    bg: bgTint || getDefaultColors().bg,
    color: iconColor || getDefaultColors().color,
  };

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full text-xs',
    md: 'w-10 h-10 rounded-full text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
  }[size];

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center shrink-0 transition-transform ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    >
      {getIcon()}
    </div>
  );
};
