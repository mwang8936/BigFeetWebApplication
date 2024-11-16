import { FC } from 'react';

type tab = {
	text: string;
	deleted: boolean;
};
interface TabsProp {
	tabs: tab[];
	selectedTab: number;
	onTabSelected(tab: number): void;
}

const Tabs: FC<TabsProp> = ({ tabs, selectedTab, onTabSelected }) => {
	return (
		<ul className="tab-ul">
			{tabs.map((tab, index) => (
				<li
					className={
						selectedTab === index
							? tab.deleted
								? 'deleted-selected-tab'
								: 'selected-tab'
							: tab.deleted
							? 'deleted-tab'
							: 'tab'
					}
					key={`${tab.text}-${index}`}
					onClick={() => {
						onTabSelected(index);
					}}>
					{tab.text}
				</li>
			))}
		</ul>
	);
};

export default Tabs;
