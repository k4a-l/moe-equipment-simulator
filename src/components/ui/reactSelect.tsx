import ReactSelectBase from "react-select";

export const CustomReactSelect: typeof ReactSelectBase = (props) => {
	const { styles, ...restProps } = props;

	return (
		<ReactSelectBase
			menuPlacement="auto"
			menuPosition="fixed"
			className="w-full"
			styles={{
				control(base, state) {
					return {
						...base,
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						overflow: "hidden",
						cursor: "pointer",
						width: "full",
						minWidth: "200px",
						borderColor: "var(--border)",
						...props.styles?.control?.(base, state),
					};
				},
				option: (style, state) => ({
					...style,
					cursor: "pointer",
					...props.styles?.option?.(style, state),
				}),
				menu: (base, state) => ({
					...base,
					width: "max-content",
					minWidth: "100%",
					height: "max-content",
					...props.styles?.menu?.(base, state),
				}),
				menuPortal: (base, state) => ({
					...base,
					zIndex: 9999,
					...props.styles?.menuPortal?.(base, state),
				}),
			}}
			placeholder=""
			components={{
				IndicatorSeparator: () => null,
			}}
			{...restProps}
		/>
	);
};
