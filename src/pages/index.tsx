import Image from "next/image";
import { Inter } from "next/font/google";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { ComboBoxResponsive } from "@/components/AnimatedMultiSelectComponent";

const inter = Inter({ subsets: ["latin"] });

const getDimensions = (ele: HTMLDivElement) => {
	// Get Height, Top and Bottom Offset of current element with respect to the parent
	const parent = document.getElementById("content-container");
	if (parent === null) return { height: 0, offsetTop: 0, offsetBottom: 0 };
	const child = ele;
	const bounderParent = parent.getBoundingClientRect();
	const bounder = ele.getBoundingClientRect();
	const height = bounder.height;
	const offsetTop = bounder.top - bounderParent.top;
	const offsetBottom = offsetTop + height;

	return {
		height,
		offsetTop,
		offsetBottom,
	};
};
const scrollTo = (ele: any) => {
	ele.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});
};

type IScectionComponent = {
	header: string;
	sectionID: string;
	referenceVar: MutableRefObject<HTMLDivElement | null>;
	children: React.ReactNode;
};

const SectionComponent = ({
	header,
	sectionID,
	referenceVar,
	children,
}: IScectionComponent) => {
	return (
		<section id={sectionID} ref={referenceVar} className="flex flex-col w-full">
			<h1 className="text-4xl font-bold">{header}</h1>
			{children}
		</section>
	);
};

const ColumnSelection = () => {
	return (
		<div className="flex items-start justify-between overflow-x-auto ">
			<div className="h-[600px] w-[400px] flex flex-col justify-between rounded border-2 border-black">
				<select multiple={true} className="h-[94%]">
					<option value={1}>1</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
					<option value={4}>4</option>
				</select>{" "}
				<button className="px-3 py-2 text-white bg-black rounded">
					Add Selected
				</button>
			</div>
			<div className="h-[600px] w-[400px] flex flex-col justify-between rounded border-2 border-black">
				<select multiple={true} className="h-[94%]">
					<option value={1}>1</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
					<option value={4}>4</option>
				</select>{" "}
				<button className="px-3 py-2 text-white bg-black rounded">
					Remove Selected
				</button>
			</div>
		</div>
	);
};
const UserGroupSelection = () => {
	return (
		<div className="flex flex-col items-start justify-between space-y-3 overflow-x-auto ">
			{/* Group Creation */}
			<div className="flex justify-start w-full ">
				<input
					type="text"
					placeholder="Group Name"
					className="px-2 py-1 border-2 border-black rounded"
				/>
				<select className="ml-2 border-2 border-black">
					<option value={1}>Priority 1</option>
					<option value={2}>Priority 2</option>
					<option value={3}>Priority 3</option>
					<option value={4}>Priority 4</option>
				</select>{" "}
				<button className="px-3 py-2 ml-2 text-white bg-black rounded">
					Create Group
				</button>
			</div>
			{/* Available User Groups */}
			<div className="flex flex-col w-full">
				<div className="w-full h-[500px] border-2 rounded border-black">
					Table Of Avaialable Groups
				</div>
				<button className="px-3 py-2 text-white bg-black rounded">
					Edit Group
				</button>
			</div>
			{/* Edit Group Section */}
			<div className="flex flex-col justify-start w-full">
				<div className="flex justify-between w-full">
					<div className="h-[400px] w-[400px] flex flex-col justify-between rounded space-y-2">
						<div>Users in Group</div>
						<select multiple={true} className="h-[90%] border-2 border-black">
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
						</select>{" "}
						<button className="px-3 py-2 text-white bg-black rounded">
							Remove Users From Group
						</button>
					</div>
					<div className="h-[400px] w-[400px] flex flex-col justify-between rounded space-y-2">
						<div>Users not in Group</div>
						<select multiple={true} className="h-[90%] border-2 border-black">
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
						</select>{" "}
						<button className="px-3 py-2 text-white bg-black rounded">
							Add Users To Group
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

type ICriteria = {
	id: string;
	title: string;
};
type IColumns = {
	id: string;
	title: string;
	options: string[];
};

type I = {
	criterias: ICriteria[];
	columns: IColumns[];
};
type SelectedOptionsState = Record<string, Record<string, string>>;
// Sample data
const criteriaArray: ICriteria[] = [
	{ id: "1", title: "criteria-1" },
	{ id: "2", title: "criteria-2" },
];

const decidingCriteria: IColumns[] = [
	{ id: "aging", title: "Aging", options: ["0-30 Days", "60-90 Days"] },
	{
		id: "dollarRange",
		title: "Dollar Range",
		options: ["1k-2.5k USD", "2.5k-5k USD"],
	},
];

type TableRowProps = {
	criteria: ICriteria;
	decidingCriteria: IColumns[];
	initialValues: InitialCriteriaValues;
};

type InitialCriteriaValues = {
	id: string;
	title: string;
	selectedDecidingCriteriaID: Record<string, string>;
};

// Simulated initial values from an API
const initialCriteriaValues: InitialCriteriaValues[] = [
	{
		id: "1",
		title: "criteria-1",
		selectedDecidingCriteriaID: {
			aging: "0-30 Days",
			dollarRange: "1k-2.5k USD",
		},
	},
	{
		id: "2",
		title: "criteria-2",
		selectedDecidingCriteriaID: {
			aging: "60-90 Days",
			dollarRange: "2.5k-5k USD",
		},
	},
];

const TableRowCrit = ({
	criteria,
	decidingCriteria,
	initialValues,
}: TableRowProps) => {
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string>
	>(initialValues.selectedDecidingCriteriaID);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);

	useEffect(() => {
		// Check if any value has been updated from the initial values
		const updated = Object.keys(selectedOptions).some(
			(key) =>
				selectedOptions[key] !== initialValues.selectedDecidingCriteriaID[key]
		);
		setIsUpdated(updated);
	}, [selectedOptions, initialValues.selectedDecidingCriteriaID]);

	const handleSelectChange = (columnId: string, value: string) => {
		setSelectedOptions((prevState) => ({
			...prevState,
			[columnId]: value,
		}));
	};

	return (
		<tr className={isUpdated ? "bg-yellow-100 text-xs" : " text-xs"}>
			<td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
				{criteria.title}
			</td>
			{decidingCriteria.map((crit) => (
				<td key={crit.id} className="px-6 py-4 whitespace-nowrap">
					<select
						value={selectedOptions[crit.id]}
						onChange={(e) => handleSelectChange(crit.id, e.target.value)}
						className="block w-full mt-1 text-xs border-2 rounded form-select"
					>
						{crit.options.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</td>
			))}
		</tr>
	);
};

const CriteriaMappingTable = () => {
	const [initialValues, setInitialValues] = useState<InitialCriteriaValues[]>(
		[]
	);

	useEffect(() => {
		// Fetch initial values from API and set the state
		setInitialValues(initialCriteriaValues); // Replace with actual API call
	}, []);

	return (
		<div className="flex w-full p-0 bg-red-100">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
							Criteria
						</th>
						{decidingCriteria.map((crit) => (
							<th
								key={crit.id}
								className="px-6 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
							>
								{crit.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{criteriaArray.map((criteria) => {
						const initialValuesForCriteria = initialValues.find(
							(val) => val.id === criteria.id
						);
						return (
							initialValuesForCriteria && (
								<TableRowCrit
									key={criteria.id}
									criteria={criteria}
									decidingCriteria={decidingCriteria}
									initialValues={initialValuesForCriteria}
								/>
							)
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

// const CriteriaRow = (props: { criteria: ICriteria; columns: IColumns[] }) => {
// 	// Create a row for criteria with each column as a selectoptions in columns variable
// 	const { criteria, columns } = props;
// 	return (
// 		<div className="flex items-center justify-start">
// 			<div>{criteria.title}</div>
// 			<div>
// 				<select key={criteria.id} className="border-2 border-black">
// 					{columns.map((column) => (
// 						<option key={column.id} value={column.id}>
// 							{column.title}
// 						</option>
// 					))}
// 				</select>
// 			</div>
// 		</div>
// 	);
// };

const CriteriaMapping = () => {
	return <CriteriaMappingTable />;
};
type IGroup = {
	groupID: string;
	groupName: string;
};

// type IInitialGroupCriteriaMapping = {
// 	gr
// }
type IUserCritiaMappingRow = {
	criteria: ICriteria;
	groups: IGroup[];
	initiallyMappedGroups: IGroup[];
	// decidingCriteria: IColumns[];
};

const UserCriteriaMappingRow = ({
	criteria,
	groups,
	initiallyMappedGroups,
}: IUserCritiaMappingRow) => {
	return (
		<div className="grid items-center justify-start w-full grid-cols-5 gap-2 mt-2">
			<div className="col-span-1 p-2 px-3 rounded">{criteria.title}</div>
			<div className="flex items-center justify-center w-full col-span-4 bg-blue-500">
				<ComboBoxResponsive
					options={groups.map((group) => ({
						option: group.groupID,
						label: group.groupName,
					}))}
					initialValues={initiallyMappedGroups.map((group) => ({
						option: group.groupID,
						label: group.groupName,
					}))}
				/>
			</div>
		</div>
	);
};

// type GroupSelectTableProps = {
// 	criteriaArray: ICriteria[];
// 	// decidingCriteria: IColumns[];
// 	groups: { groupID: string; groupName: string }[];
// 	initialCriteriaValues: InitialCriteriaValues[];
// };

// const GroupSelectTable: React.FC<GroupSelectTableProps> = ({
// 	criteriaArray,
// 	// decidingCriteria,
// 	groups,
// 	initialCriteriaValues,
// }) => {
// 	const [criteriaValues, setCriteriaValues] = useState<InitialCriteriaValues[]>(
// 		initialCriteriaValues
// 	);

// 	const handleDecidingCriteriaChange = (
// 		criteriaId: string,
// 		columnId: string,
// 		value: string
// 	) => {
// 		setCriteriaValues((prevValues) =>
// 			prevValues.map((criteria) =>
// 				criteria.id === criteriaId
// 					? {
// 							...criteria,
// 							selectedDecidingCriteriaID: {
// 								...criteria.selectedDecidingCriteriaID,
// 								[columnId]: value,
// 							},
// 					  }
// 					: criteria
// 			)
// 		);
// 	};

// 	const handleGroupChange = (criteriaId: string, selectedOptions: any) => {
// 		setCriteriaValues((prevValues) =>
// 			prevValues.map((criteria) =>
// 				criteria.id === criteriaId
// 					? {
// 							...criteria,
// 							selectedGroups: selectedOptions.map(
// 								(option: any) => option.value
// 							),
// 					  }
// 					: criteria
// 			)
// 		);
// 	};

// 	useEffect(() => {
// 		console.log("Updated criteria values:", criteriaValues);
// 	}, [criteriaValues]);

// 	return (
// 		<div className="container p-4 mx-auto">
// 			<table className="min-w-full divide-y divide-gray-200">
// 				<thead className="bg-gray-50">
// 					<tr>
// 						<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
// 							Criteria
// 						</th>
// 						<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
// 							Groups
// 						</th>
// 						{decidingCriteria.map((crit) => (
// 							<th
// 								key={crit.id}
// 								className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
// 							>
// 								{crit.title}
// 							</th>
// 						))}
// 					</tr>
// 				</thead>
// 				<tbody className="bg-white divide-y divide-gray-200">
// 					{criteriaArray.map((criteria) => {
// 						const initialValues = initialCriteriaValues.find(
// 							(val) => val.id === criteria.id
// 						);
// 						if (!initialValues) return null;

// 						return (
// 							<tr key={criteria.id}>
// 								<td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
// 									{criteria.title}
// 								</td>
// 								<td className="px-6 py-4 whitespace-nowrap">
// 									<Select
// 										isMulti
// 										value={groups
// 											.filter((group) => initialValues.includes(group.groupID))
// 											.map((group) => ({
// 												value: group.groupID,
// 												label: group.groupName,
// 											}))}
// 										options={groups.map((group) => ({
// 											value: group.groupID,
// 											label: group.groupName,
// 										}))}
// 										onChange={(selectedOptions) =>
// 											handleGroupChange(criteria.id, selectedOptions)
// 										}
// 									/>
// 								</td>
// 								{decidingCriteria.map((crit) => (
// 									<td key={crit.id} className="px-6 py-4 whitespace-nowrap">
// 										<select
// 											value={initialValues.selectedDecidingCriteriaID[crit.id]}
// 											onChange={(e) =>
// 												handleDecidingCriteriaChange(
// 													criteria.id,
// 													crit.id,
// 													e.target.value
// 												)
// 											}
// 											className="block w-full mt-1 form-select"
// 										>
// 											{crit.options.map((option) => (
// 												<option key={option} value={option}>
// 													{option}
// 												</option>
// 											))}
// 										</select>
// 									</td>
// 								))}
// 							</tr>
// 						);
// 					})}
// 				</tbody>
// 			</table>
// 		</div>
// 	);
// };

const initialGroupsFromAPI: IGroup[] = [
	{ groupID: "1", groupName: "Group 1" },
	{ groupID: "2", groupName: "Group 2" },
	{ groupID: "3", groupName: "Group 3" },
	{ groupID: "4", groupName: "Group 4" },
];
const initialGroupMappingFromAPI: IUserCritiaMappingRow[] = [
	{
		criteria: { id: "1", title: "criteria-1" },
		groups: initialGroupsFromAPI,
		initiallyMappedGroups: [{ groupID: "1", groupName: "Group 1" }],
	},
	{
		criteria: { id: "2", title: "criteria-2" },
		groups: initialGroupsFromAPI,
		initiallyMappedGroups: [
			{ groupID: "2", groupName: "Group 2" },
			{ groupID: "3", groupName: "Group 3" },
		],
	},
];

const UserCriteriaMapping = () => {
	return (
		<div className="flex flex-col items-start justify-between mt-3">
			{/* Group Creation */}
			{/* <UserCriteriaMappingRow  />
			 */}
			{initialGroupMappingFromAPI.map((item) => {
				return (
					<UserCriteriaMappingRow
						key={item.criteria.id}
						criteria={item.criteria}
						groups={item.groups}
						initiallyMappedGroups={item.initiallyMappedGroups}
					/>
				);
			})}
		</div>
	);
};

export default function Home() {
	const [visibleSection, setVisibleSection] = useState<string | undefined>(
		undefined
	);

	const headerRef = useRef(null);

	//  Refs for the index-section headings
	const indexSection1Ref = useRef(null);
	const indexSection2Ref = useRef(null);
	const indexSection3Ref = useRef(null);
	const indexSection4Ref = useRef(null);

	//  Refs for the sections
	const sectionRefs = [
		{ section: "column-selection", ref: indexSection1Ref },
		{ section: "user-group-selection", ref: indexSection2Ref },
		{ section: "criteria-mapping", ref: indexSection3Ref },
		{ section: "user-criteria-mapping", ref: indexSection4Ref },
	];
	// const section1Ref = useRef(null);
	// const section2Ref = useRef(null);

	useEffect(() => {
		// .log("HELLO");
		// handle Scrolling function
		const contentContainer = document.getElementById(
			"content-container"
		) as HTMLDivElement;
		if (contentContainer) {
			const handleScroll = () => {
				// .log("handleScroll init");
				//  Get the current scroll position
				// const { height: headerHeight } = getDimensions(headerRef.current);
				const scrollPosition = contentContainer.scrollTop;

				const selected = sectionRefs.find(({ section, ref }) => {
					const ele = ref.current;
					if (ele) {
						const { offsetBottom, offsetTop } = getDimensions(ele);
						// .log({
						// 	scrollPosition: scrollPosition,
						// 	offsetTop: offsetTop,
						// 	offsetBottom: offsetBottom,
						// });
						return scrollPosition > offsetTop && scrollPosition < offsetBottom;
					}
				});

				if (selected && selected.section !== visibleSection) {
					setVisibleSection(selected.section);
				} else if (!selected && visibleSection) {
					setVisibleSection(undefined);
				}
				// .log("Visible Section:", visibleSection);
			};
			handleScroll();

			contentContainer.addEventListener("scroll", handleScroll);
			return () => {
				contentContainer.removeEventListener("scroll", handleScroll);
			};
		}
		// if
	}, []);
	return (
		<main
			className={` h-screen w-screen flex bg-white min-h-screen flex-col items-center justify-between pt-5 pl-24 ${inter.className}`}
		>
			<div className="flex justify-between w-full h-full p-2 ">
				<div
					id="content-container"
					className="w-full h-full space-y-10 overflow-y-scroll "
				>
					<SectionComponent
						header="Column Selection"
						sectionID="column-selection"
						referenceVar={indexSection1Ref}
					>
						<ColumnSelection />
					</SectionComponent>
					<SectionComponent
						header="User Group Selection"
						sectionID="user-group-selection"
						referenceVar={indexSection2Ref}
					>
						<UserGroupSelection />
					</SectionComponent>
					<SectionComponent
						header="Criteria Mapping"
						sectionID="criteria-mapping"
						referenceVar={indexSection3Ref}
					>
						<CriteriaMapping />
					</SectionComponent>
					<SectionComponent
						header="User Group Criteria Mapping"
						sectionID="user-criteria-mapping"
						referenceVar={indexSection4Ref}
					>
						<UserCriteriaMapping />
					</SectionComponent>
				</div>
				<div
					ref={headerRef}
					id="index-section"
					className="h-full w-[300px] pl-5"
				>
					<ul className="">
						<li
							onMouseDown={() => {
								scrollTo(indexSection1Ref.current);
							}}
							className={`hover:text-blue-700 hover:cursor-pointer ${
								visibleSection === "column-selection" ? "font-bold" : ""
							}`}
						>
							Section 1
						</li>
						<li
							onMouseDown={() => {
								scrollTo(indexSection2Ref.current);
							}}
							className={`hover:text-blue-700 hover:cursor-pointer ${
								visibleSection === "user-group-selection" ? "font-bold" : ""
							}`}
						>
							Section 2
						</li>
						<li
							onMouseDown={() => {
								scrollTo(indexSection3Ref.current);
							}}
							className={`hover:text-blue-700 hover:cursor-pointer ${
								visibleSection === "user-group-selection" ? "font-bold" : ""
							}`}
						>
							Section 3
						</li>
						<li
							onMouseDown={() => {
								scrollTo(indexSection4Ref.current);
							}}
							className={`hover:text-blue-700 hover:cursor-pointer ${
								visibleSection === "user-group-selection" ? "font-bold" : ""
							}`}
						>
							Section 4
						</li>
					</ul>
				</div>
			</div>
		</main>
	);
}
