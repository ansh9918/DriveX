"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

const Sort = () => {
    const router = useRouter();
    const path = usePathname();

    const handleSort = (value) => {
        router.push(`${path}?sort=${value}`);
    };
    return (
        <Select onValueChange={handleSort} defaultvalue={sortTypes[0].value}>
            <SelectTrigger className="sort-select">
                <SelectValue placeholder={sortTypes[0].label} />
            </SelectTrigger>
            <SelectContent className="sort-select-content">
                {sortTypes.map((sort) => (
                    <SelectItem
                        key={sort.label}
                        className="shad-select-item"
                        value={sort.value}>
                        {sort.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default Sort;
