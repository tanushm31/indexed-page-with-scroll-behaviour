import React, { useEffect, useMemo, useState } from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";

// import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { init } from "next/dist/compiled/webpack/webpack";
import { IoCheckbox, IoClose } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
// import { colourOptions } from '../data';

export function useMediaQuery(query: string) {
	const [value, setValue] = React.useState(false);

	React.useEffect(() => {
		function onChange(event: MediaQueryListEvent) {
			setValue(event.matches);
		}

		const result = matchMedia(query);
		result.addEventListener("change", onChange);
		setValue(result.matches);

		return () => result.removeEventListener("change", onChange);
	}, [query]);

	return value;
}

type IOption = {
	option: string;
	label: string;
};

const animatedComponents = makeAnimated();

type IAnimatedMultiProps = {
	options: IOption[];
	initialValues: IOption[];
};

// // "use client"

// import * as React from "react"

type Status = {
	option: string;
	label: string;
};

const statuses: Status[] = [
	{
		option: "backlog",
		label: "Backlog",
	},
	{
		option: "todo",
		label: "Todo",
	},
	{
		option: "in progress",
		label: "In Progress",
	},
	{
		option: "done",
		label: "Done",
	},
	{
		option: "canceled",
		label: "Canceled",
	},
];

const SelectedOptionTag = ({ option }: { option: Status }) => {
	return (
		<div className="flex items-center justify-around p-1 px-2 mr-3 text-xs bg-blue-200 rounded">
			{option.label}
			{/* <IoClose  className="w-4 h-"/> */}
		</div>
	);
};

export function ComboBoxResponsive({
	options,
	initialValues,
}: IAnimatedMultiProps) {
	// const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 200px)");
	// const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
	// 	null
	// );

	const [clicked, setClicked] = useState(false);
	const [open, setOpen] = useState(false);

	const [selectedStatus, setSelectedStatus] =
		useState<IOption[]>(initialValues);

	const allOptionsWithSelectedTag = useMemo<IOptionWithSelectedTag[]>(() => {
		return options.map((option) => {
			return {
				...option,
				selected: selectedStatus
					.map((item) => item.option)
					.includes(option.option),
				initiallySelected: initialValues
					.map((item) => item.option)
					.includes(option.option),
			};
		});
	}, [selectedStatus, options, initialValues]);

	const isModified = useMemo(() => {
		const modified = allOptionsWithSelectedTag.some(
			(option) => option.selected !== option.initiallySelected
		);
		return modified;
	}, [allOptionsWithSelectedTag]);
	// const isCriteriaOptionsModified = useMemo(() => {
	// 	// return selectedStatus.length > 0;
	// }, [selectedStatus]);

	const handleUpdateSelectedStatus = (status: IOption) => {
		if (selectedStatus.map((item) => item.option).includes(status.option)) {
			const filteredStatuses = selectedStatus.filter(
				(s) => s.option !== status.option
			);
			setSelectedStatus(filteredStatuses);
		} else {
			setSelectedStatus([...selectedStatus, status]);
		}
		// setSelectedStatus(status);
	};

	if (true) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={`flex justify-start items-center w-full ${
							isModified ? "bg-yellow-100 hover:bg-yellow-100/80" : ""
						}`}
					>
						{selectedStatus.length > 0 ? (
							// <>
							// 	{selectedStatus.map((item) => (
							// 		<>{item.label}</>
							// 	))}
							// </>

							selectedStatus.map((item) => (
								<SelectedOptionTag key={item.option} option={item} />
							))
						) : (
							// <SelectedOptionTag option={item}/>
							<>+ Set Group</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<StatusList
						options={allOptionsWithSelectedTag}
						setOpen={setOpen}
						setSelectedStatus={handleUpdateSelectedStatus}
						// selectedOptions={initialValues}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className="w-[150px] justify-start">
					{selectedStatus.length > 0 ? (
						<>
							{selectedStatus.map((item) => (
								<>{item.label}</>
							))}
						</>
					) : (
						<>+ Set Group</>
					)}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<StatusList
						options={allOptionsWithSelectedTag}
						setOpen={setOpen}
						setSelectedStatus={handleUpdateSelectedStatus}
						// selectedOptions={initialValues}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

type IOptionWithSelectedTag = IOption & {
	selected: boolean;
	initiallySelected: boolean;
};

function StatusList({
	setOpen,
	setSelectedStatus,
	options,
}: // selectedOptions,
{
	setOpen: (open: boolean) => void;
	setSelectedStatus: (status: Status) => void;
	options: IOptionWithSelectedTag[];
	// selectedOptions: IOption[];
}) {
	return (
		<Command>
			<CommandInput placeholder="Filter Group..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{options.map((opt) => (
						<CommandItem
							key={opt.option}
							value={opt.option}
							onSelect={(value) => {
								setSelectedStatus(opt);
								// setOpen(false);
							}}
							className="space-x-2"
						>
							<span>
								{opt.selected ? (
									<IoCheckbox />
								) : (
									<MdOutlineCheckBoxOutlineBlank />
								)}
							</span>
							<span>{opt.label}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

// export default function AnimatedMulti({
// 	options,
// 	initialValues,
// }: IAnimatedMultiProps) {
// 	console.log("options", options);

// 	const [clicked, setClicked] = useState(false);
// 	const [open, setOpen] = useState(false);

// 	const [selectedStatus, setSelectedStatus] = useState<Status[]>([]);

// 	const handleUpdateSelectedStatus = (status: IOption) => {
// 		if (selectedStatus.includes(status)) {
// 			setSelectedStatus(
// 				selectedStatus.filter((s) => s.option !== status.option)
// 			);
// 		} else {
// 			setSelectedStatus([...selectedStatus, status]);
// 		}
// 		// setSelectedStatus(status);
// 	};

// 	return (
// 		<div
// 			onMouseDown={() => {
// 				setClicked(!clicked);
// 			}}
// 			className="relative flex items-center justify-start w-full p-3 text-white bg-blue-700 rounded"
// 		>
// 			No Options Selected
// 			{/* <div> */}
// 			<StatusList
// 				setOpen={setOpen}
// 				setSelectedStatus={handleUpdateSelectedStatus}
// 				key={"status"}
// 				options={options}
// 				selectedOptions={[]}
// 			/>
// 			{/* </div> */}
// 			{/* <Select
// 				className="w-full"
// 				closeMenuOnSelect={false}
// 				components={animatedComponents}
// 				defaultValue={initialValues}
// 				isMulti
// 				options={options}
// 			/> */}
// 		</div>
// 	);
// }
