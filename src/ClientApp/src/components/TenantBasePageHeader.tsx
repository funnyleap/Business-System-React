﻿import * as React from 'react';
import { Jumbotron } from 'reactstrap';

interface TenantBasePageHeaderProps {
    children?: JSX.Element | JSX.Element[];
    id: string;
}

const TenantBasePageHeader: React.FC<TenantBasePageHeaderProps> = ({ children, id }: TenantBasePageHeaderProps) => ((
    <Jumbotron
        id={id}
        style={{
            marginTop: 11,
            minHeight: 177, // 140 for content + 11 for padding top and bottom
            paddingTop: 11,
            paddingBottom: 22,
        }}
    >
        {children}
    </Jumbotron>
));

export default TenantBasePageHeader;