import { FC } from 'react';

interface TabsProp {
	tabs: string[];
	selectedTab: number;
	onTabSelected(tab: number): void;
	disabled?: boolean;
}

const Tabs: FC<TabsProp> = ({
	tabs,
	selectedTab,
	onTabSelected,
	disabled = false,
}) => {
	return (
		<ul className="tab-ul">
			{tabs.map((tab, index) => (
				<li
					style={{
						cursor: disabled ? 'not-allowed' : 'pointer',
					}}
					className={selectedTab === index ? 'selected-tab' : 'tab'}
					key={`${tab}-${index}`}
					onClick={() => {
						if (!disabled) onTabSelected(index);
					}}>
					{tab}
				</li>
			))}
		</ul>
	);
};

export default Tabs;
