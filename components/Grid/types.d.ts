import React from 'react';

export type ColType = {
    [breakpoint: 'md' | 'lg' | 'xl']: number;
};

export type GridProps = {
    children: React.ReactNode;
    centered?: boolean;
    cols?: ColType;
    className?: string;
};
