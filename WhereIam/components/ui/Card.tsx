import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from "@shopify/restyle";
import { Theme } from "@/theme/theme";
import { TouchableOpacity } from "react-native";

const variant = createVariant<Theme>({ themeKey: "cardVariants" });

const Card = createRestyleComponent<
  VariantProps<Theme, "cardVariants"> &
    React.ComponentProps<typeof TouchableOpacity>,
  Theme
>([variant], TouchableOpacity);

export default Card;
