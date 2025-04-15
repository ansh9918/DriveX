"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const FileUploader = ({ ownerId, accountId, className }) => {
    const path = usePathname();

    const [files, setFiles] = useState([]);

    const onDrop = useCallback(
        async (acceptedFiles) => {
            // Do something with the files
            setFiles(acceptedFiles);
            const uploadPromises = acceptedFiles.map(async (file) => {
                if (file.size > MAX_FILE_SIZE) {
                    setFiles((prevFile) =>
                        prevFile.filter((f) => f.name !== file.name)
                    );
                    return toast(
                        <p className="body-2 text-white">
                            <span className="font-semibold">{file.name}</span>{" "}
                            is too large. Max file size is 50MB
                        </p>,
                        {
                            style: {
                                backgroundColor: "#FF7474",
                                borderRadius: "10px",
                            },
                        }
                    );
                }
                //return null;
                return uploadFile({ file, ownerId, accountId, path }).then(
                    (uploadedFile) => {
                        if (uploadedFile) {
                            setFiles((prevFiles) => {
                                const updatedFiles = prevFiles.filter(
                                    (f) => f.name !== file.name
                                );
                                return updatedFiles;
                            });
                            toast(
                                <p className="body-2 text-white">
                                    <span className="font-semibold">
                                        {file.name}
                                    </span>{" "}
                                    uploaded successfully.
                                </p>,
                                {
                                    style: {
                                        backgroundColor: "#4CAF50",
                                        borderRadius: "10px",
                                    },
                                }
                            );
                        }
                    }
                );
            });

            await Promise.all(uploadPromises);
        },
        [ownerId, path, accountId]
    );
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    const handleRemoveFile = (e, fileName) => {
        e.stopPropagation();
        setFiles((prevFile) =>
            prevFile.filter((file) => file.name !== fileName)
        );
    };

    return (
        <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <Button type="button" className={cn("uploader-button", className)}>
                <Image
                    src="/assets/icons/upload.svg"
                    alt="upload"
                    width={24}
                    height={24}
                />
                <p>Upload</p>
            </Button>
            {files.length > 0 && (
                <ul className="uploader-preview-list">
                    <h4 className="h4 text-light-100">Uploading</h4>
                    {files.map((file, index) => {
                        const { type, extension } = getFileType(file.name);

                        return (
                            <li
                                key={`${file.name}-${index}`}
                                className="uploader-preview-item">
                                <div className="flex items-center gap-3">
                                    <Thumbnail
                                        type={type}
                                        extension={extension}
                                        url={convertFileToUrl(file)}
                                    />

                                    <div className="preview-item-name">
                                        {file.name}
                                        {file && (
                                            <Image
                                                src="/assets/icons/file-loader.gif"
                                                width={80}
                                                height={26}
                                                alt="loader"
                                            />
                                        )}
                                    </div>
                                </div>
                                <Image
                                    src="/assets/icons/remove.svg"
                                    width={24}
                                    height={24}
                                    alt="remove"
                                    onClick={(e) =>
                                        handleRemoveFile(e, file.name)
                                    }
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FileUploader;
