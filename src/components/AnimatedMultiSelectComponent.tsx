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
import { IoCheckbox } from "react-icons/io5";
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

	const handleUpdateSelectedStatus = (status: IOption) => {
		if (selectedStatus.includes(status)) {
			setSelectedStatus(
				selectedStatus.filter((s) => s.option !== status.option)
			);
		} else {
			setSelectedStatus([...selectedStatus, status]);
		}
		// setSelectedStatus(status);
	};

	if (true) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" className="justify-start w-full">
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
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<StatusList
						options={options}
						setOpen={setOpen}
						setSelectedStatus={handleUpdateSelectedStatus}
						selectedOptions={initialValues}
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
						options={options}
						setOpen={setOpen}
						setSelectedStatus={handleUpdateSelectedStatus}
						selectedOptions={initialValues}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function StatusList({
	setOpen,
	setSelectedStatus,
	options,
	selectedOptions,
}: {
	setOpen: (open: boolean) => void;
	setSelectedStatus: (status: Status) => void;
	options: IOption[];
	selectedOptions: IOption[];
}) {
	// const handleIsOptionSelected = (option: IOption) => {
	//     return selectedOptions.map((item) => item.option).includes(option.option);
	// }
	// const isOptionSelected = useMemo(() => handleIsOptionSelected(s), [selectedOptions]);
	// const optionVsSelected = useMemo(, [options, selectedOptions]);
	const fnnn = () => {
		return options.map((option) => {
			return {
				...option,
				selected: selectedOptions
					.map((item) => item.option)
					.includes(option.option),
			};
		});
	};

	const [optionVsSelected, setOptionVsSelected] = useState(fnnn());
	useEffect(() => {
		console.log("selectedOptions", selectedOptions);
		setOptionVsSelected(fnnn());
	}, [selectedOptions]);
	return (
		<Command>
			<CommandInput placeholder="Filter Group..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{optionVsSelected.map((status) => (
						<CommandItem
							key={status.option}
							value={status.option}
							onSelect={(value) => {
								setSelectedStatus(status);
								setOpen(false);
							}}
							className="space-x-2"
						>
							<span>
								{status.selected ? (
									<IoCheckbox />
								) : (
									<MdOutlineCheckBoxOutlineBlank />
								)}
							</span>
							<span>{status.label}</span>
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
