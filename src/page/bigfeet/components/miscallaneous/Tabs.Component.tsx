interface TabsProp {
	tabs: string[];
	selectedTab: number;
	onTabSelected(tab: number): void;
}

export default function Tabs(prop: TabsProp) {
	return (
		<ul className='flex flex-wrap text-sm font-medium text-center border-b border-gray-200 mt-3'>
			{prop.tabs.map((tab, index) => (
				<li
					className={
						prop.selectedTab === index ? 'selected-tab' : 'tab'
					}
					key={`${tab}-${index}`}
					onClick={() => {
						prop.onTabSelected(index);
					}}
				>
					{tab}
				</li>
			))}
		</ul>
	);
}
