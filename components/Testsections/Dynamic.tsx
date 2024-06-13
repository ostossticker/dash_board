"use client"
import React, { useEffect, useState } from 'react';

interface DynamicElement {
  element: JSX.Element;
  fontSize?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}

interface DynamicContainerProps {
  elements: DynamicElement[];
}

const DynamicContainer: React.FC<DynamicContainerProps> = ({ elements }) => {
  const [dynamicElements, setDynamicElements] = useState<DynamicElement[]>(elements);

  useEffect(() => {
    const handleResize = () => {
      const updatedElements = elements.map((element) => {
        const { fontSize, width, height } = element;

        const newHeight = height !== undefined && typeof height === 'number' ? Math.max(100, height * (window.innerHeight / 800)) : 'auto';

        return {
          ...element,
          fontSize: fontSize ? Math.max(10, fontSize * (window.innerWidth / 1440)) : undefined,
          width: width !== undefined && typeof width === 'number' ? Math.max(100, width * (window.innerWidth / 1440)) : 'auto',
          height: newHeight,
        };
      });
      setDynamicElements(updatedElements);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [elements]);

  return (
    <div>
      {dynamicElements.map((element, index) => {
        const { fontSize, width, height, className } = element;
        const style: React.CSSProperties = {};

        if (fontSize) style.fontSize = `${fontSize}px`;
        if (width) style.width = typeof width === 'number' ? `${width}px` : width;
        if (height) style.height = typeof height === 'number' ? `${height}px` : height;

        // Determine element type dynamically
        const ElementType = element.element.type as keyof JSX.IntrinsicElements;

        return (
          <ElementType
            key={index}
            className={className}
            style={style}
          >
            {element.element.props.children}
          </ElementType>
        );
      })}
    </div>
  );
};

export default DynamicContainer;
