import { SheetContainer } from "@/features/sheet/SheetContainer";
import { getLocalData } from "../api/getLocalData";

const { weapons, shields, defences, buffs } = getLocalData();

export default function EquipmentSimPage() {
	return (
		<SheetContainer
			weapons={weapons}
			shields={shields}
			defences={defences}
			buffs={buffs}
		/>
	);
}
