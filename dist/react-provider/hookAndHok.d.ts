import React from 'react';
export declare function repkaHookAndHoc<T extends object>(this: T, arg: React.ComponentType<any> | keyof T): React.FC<any> | T[keyof T];
