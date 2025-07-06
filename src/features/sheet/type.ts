import type {
	DefenceItem,
	DefencePart,
	EQUIPMENT_TYPE,
	InjectBuff,
	WeaponItem,
	WeaponPart,
} from "@/types/Item";

export type ItemOfPart =
	| {
			type: typeof EQUIPMENT_TYPE.defences;
			part: DefencePart;
			item?: InjectBuff<DefenceItem>;
	  }
	| {
			type: typeof EQUIPMENT_TYPE.shields;
			part: WeaponPart;
			item?: InjectBuff<WeaponItem>;
	  }
	| {
			type: typeof EQUIPMENT_TYPE.weapons;
			part: WeaponPart;
			item?: InjectBuff<WeaponItem>;
	  };
