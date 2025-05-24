import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ViewTable from "@/components/tables/ViewTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Apolo - Viewers"
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Viewers" />
      <div className="space-y-6">
        <ComponentCard title="Listagem dos usuários viewers">
          <ViewTable />
        </ComponentCard>
      </div>
    </div>
  );
}
