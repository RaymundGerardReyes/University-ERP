import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CatalogSearchPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Library Catalog Search" 
        subtitle="Search books, journals, and digital collections." 
      />
      <Card>
        <p>Library Catalog Search is active and initialized.</p>
      </Card>
    </div>
  );
};

export default CatalogSearchPage;
