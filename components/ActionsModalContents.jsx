import Image from "next/image";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ImageThumbnail = ({ file }) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex-col flex ">
            <p className="subtitle-2 mb-1">{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className="caption" />
        </div>
    </div>
);

const Deatils = ({ label, value }) => (
    <div className="flex">
        <p className="file-details-label text-left">{label}</p>
        <p className="file-details-value text-left">{value}</p>
    </div>
);

export const FileDetails = ({ file }) => {
    return (
        <>
            <ImageThumbnail file={file} />
            <div className="space-y-4 px-2 pt-2">
                <Deatils label="Format: " value={file.extension} />
                <Deatils label="Size: " value={convertFileSize(file.size)} />
                <Deatils label="Owner: " value={file.owner.fullName} />
                <Deatils
                    label="Last edit: "
                    value={formatDateTime(file.$updatedAt)}
                />
            </div>
        </>
    );
};

export const ShareInput = ({ file, onInputChange, onRemove }) => {
    return (
        <>
            <ImageThumbnail file={file} />

            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">
                    Share file with other users
                </p>
                <Input
                    type="email"
                    placeholder="Enter email address"
                    onChange={(e) =>
                        onInputChange(e.target.value.trim().split(","))
                    }
                    className="share-input-field"
                />
                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">
                            Shared with:{" "}
                        </p>
                        <p className="subtitle-2 text-light-100">
                            {file.users.length} users
                        </p>
                    </div>
                    <ul className="pt-2">
                        {file.users.map((email) => (
                            <li
                                key={email}
                                className="flex items-center justify-between gap-2">
                                <p className="subtitle-2">{email}</p>
                                <Button
                                    onClick={() => onRemove(email)}
                                    className="share-remove-user">
                                    <Image
                                        src="/assets/icons/remove.svg"
                                        alt="remove"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
