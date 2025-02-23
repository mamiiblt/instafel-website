"use client";

import { Header, Footer, LoadingBar } from "@/components/ifl";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthorComponent } from "@/components/AuthorComponent"; // Importing AuthorComponent
import { OpenInInstafelComponent } from "@/components/OpenInInstafelComponent"; // Importing AuthorComponent
import { useImportInInstafelModal } from "@/components/useImportInInstafelModal";
import { saveAs } from "file-saver";

export default function Backup() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const requestUrl = `https://raw.githubusercontent.com/instafel/backups/refs/heads/main/${id}/manifest.json`;
      const res = await fetch(requestUrl);
      const result = await res.json();
      setData(result.manifest);
    };
    fetchData();
  }, [id]);

  const handleDownload = async (id, version) => {
    const link = document.createElement("a");
    link.href = `https://api.mamiiblt.me/ifl/dw_backup?id=${id}&version=${version}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { ImportInInstafelModal, openModal } = useImportInInstafelModal();
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main>
        {data ? (
          <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <div className="flex items-center gap-2" />
            </div>
            <div className="grid gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">About the Backup</h2>
                <p className="text-sm text-muted-foreground">{data.description}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Backup Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Owner</p>
                    <AuthorComponent
                      authorName={data.author}
                      showAuthorSocials={data.optional.show_author_socials}
                      authorData={data.optional_values.author_socials}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Version</p>
                    <p className="text-sm text-muted-foreground">
                      {data.version_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {data.last_updated}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Changelog</h2>
                <div className="grid gap-2">
                  <p dangerouslySetInnerHTML={{ __html: data.changelog.replace(/\n/g, "<br />") }} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Button onClick={() => handleDownload(id, data.version_name)} size="lg">
                  Download Backup
                </Button>
                <OpenInInstafelComponent />
              </div>
            </div>
          </div>
        ) : (
          <LoadingBar />
        )}
      </main>
      {data ? <Footer /> : <div />}
    </div>
  );
}
