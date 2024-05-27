import Image from "next/image";
import { Inter } from "next/font/google";
import { MutableRefObject, useEffect, useRef, useState } from "react";

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

export default function Home() {
	const [visibleSection, setVisibleSection] = useState<string | undefined>(
		undefined
	);

	const headerRef = useRef(null);

	//  Refs for the index-section headings
	const indexSection1Ref = useRef(null);
	const indexSection2Ref = useRef(null);

	//  Refs for the sections
	const sectionRefs = [
		{ section: "column-selection", ref: indexSection1Ref },
		{ section: "user-group-selection", ref: indexSection2Ref },
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
					className="w-full h-full space-y-2 space-y-10 overflow-y-scroll "
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
					</ul>
				</div>
			</div>
		</main>
	);
}
