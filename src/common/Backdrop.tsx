import React from 'react';

const Backdrop = ({ opacity, onClick }: { opacity: number, onClick: () => void }) => (
    <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `rgba(0, 0, 0, ${opacity})`,
        }}
        onClick={onClick}
    />
);

export default Backdrop;
