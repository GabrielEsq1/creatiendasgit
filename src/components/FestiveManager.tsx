'use client';

import { useState } from 'react';
import SnowOverlay from './SnowOverlay';
import FestiveToggle from './FestiveToggle';

export default function FestiveManager() {
    const [festive, setFestive] = useState(true);

    return (
        <>
            <SnowOverlay enabled={festive} />
            <FestiveToggle onChange={setFestive} />
        </>
    );
}
