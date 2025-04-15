import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils";
import React from "react";

const Page = async ({ searchParams, params }) => {
    const { type } = (await params) || "";
    const searchText = (await searchParams)?.query || "";
    const sort = (await searchParams)?.sort || "";
    const types = getFileTypesParams(type);

    const files = await getFiles({ types, searchText, sort });
    console.log(files);
    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>
                <div className="total-size-section">
                    <p className="body-1">
                        Total : <span className="h5">0 MB</span>
                    </p>
                    <div className="sort-container">
                        <p className="body-1 hidden sm:block text-light-200">
                            Sort by:{" "}
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>

            {files.total > 0 ? (
                <section className="file-list">
                    {files.documents.map((file) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    );
};

export default Page;
