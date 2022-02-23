import { Qualification } from "@prisma/client";
import Image from 'next/image';
import React from 'react';

type Props = {
    qualification: Qualification,
    size?: string | number,
}

const QualificationBadge: React.FC<Props> = ({ qualification, size }) => {
    size = size || 180;

    return (
        <Image src={`/qualification/${qualification}.jpg`} alt={qualification} width={size} height={size} unoptimized />
    )
}

export default QualificationBadge;