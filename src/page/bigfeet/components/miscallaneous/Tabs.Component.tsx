import { FC } from 'react';

interface TabsProp {
	tabs: string[];
	selectedTab: number;
	onTabSelected(tab: number): void;
}

const Tabs: FC<TabsProp> = ({ tabs, selectedTab, onTabSelected }) => {
	return (
		<ul className="tab-ul">
			{tabs.map((tab, index) => (
				<li
					className={selectedTab === index ? 'selected-tab' : 'tab'}
					key={`${tab}-${index}`}
					onClick={() => {
						onTabSelected(index);
					}}>
					{tab}
				</li>
			))}
		</ul>
	);
};

export default Tabs;
