import { useLocation } from "@/context/LocationContext";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { ArrowsRightLeftIcon } from "react-native-heroicons/outline";
import { useCurrency } from "@/hooks/use-currency";

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  currency: string | null;
}

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#111111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

export const CurrencyModal = ({
  visible,
  onClose,
  currency,
}: CurrencyModalProps) => {
  const { themeColors } = useLocation();
  const [amount, setAmount] = useState<string>("");
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toUSD, setToUSD] = useState(true);
  const {
    boolean: currencyExists,
    isLoading,
    error: currencyError,
  } = useCurrency(currency);

  const sheetBg = themeColors?.[0] || "#ffffff";
  const textColor = getReadableTextColor(sheetBg);
  const isLight = textColor === "#111111";
  const cardBg = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.12)";
  const cardBorder = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.16)";
  const dimText = isLight ? "rgba(17,17,17,0.5)" : "rgba(255,255,255,0.55)";
  const inputBg = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)";
  const inputBorder = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.22)";
  // Inverted button: textColor as bg, sheetBg as text
  const btnBg = textColor;
  const btnText = isLight ? "#ffffff" : "#111111";

  const handleConvert = async () => {
    if (!currency || !amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    setError(null);
    setConverted(null);
    try {
      const from = toUSD ? currency : "USD";
      const to = toUSD ? "USD" : currency;
      const response = await fetch(
        `https://juanmalorenzo.com/api/${from}/${to}/${amount}`
      );
      const data = await response.json();
      if (typeof data === "number" && !isNaN(data)) {
        setConverted(data);
      } else {
        setError("Conversion failed.");
      }
    } catch (e) {
      setError("Error fetching conversion.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setToUSD((prev) => !prev);
    setConverted(null);
    setAmount("");
    setError(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: sheetBg,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: isLight
                ? "rgba(0,0,0,0.08)"
                : "rgba(255,255,255,0.15)",
              padding: 24,
              paddingBottom: Platform.OS === "ios" ? 40 : 24,
              minHeight: 320,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: isLight
                  ? "rgba(0,0,0,0.15)"
                  : "rgba(255,255,255,0.3)",
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 22, fontWeight: "800", color: textColor }}
              >
                Currency
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: isLight
                    ? "rgba(0,0,0,0.08)"
                    : "rgba(255,255,255,0.15)",
                  borderRadius: 50,
                  padding: 8,
                }}
              >
                <XMarkIcon size={22} color={textColor} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View
                style={{
                  paddingVertical: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color={textColor} />
              </View>
            ) : !currencyExists ? (
              <View
                style={{
                  paddingVertical: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: dimText,
                    textAlign: "center",
                  }}
                >
                  Not available in this region
                </Text>
              </View>
            ) : (
              <>
                {/* Direction toggle */}
                <TouchableOpacity
                  onPress={handleSwitch}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: cardBorder,
                    borderRadius: 16,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    marginBottom: 20,
                    alignSelf: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 15,
                      color: textColor,
                      letterSpacing: 0.5,
                    }}
                  >
                    {toUSD ? `${currency} → USD` : `USD → ${currency}`}
                  </Text>
                  <ArrowsRightLeftIcon size={18} color={textColor} />
                </TouchableOpacity>

                {/* Label */}
                <Text
                  style={{
                    fontSize: 11,
                    color: dimText,
                    fontWeight: "700",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {toUSD ? `Amount in ${currency}` : "Amount in USD"}
                </Text>

                {/* Input */}
                <TextInput
                  placeholder={toUSD ? `0.00 ${currency}` : "0.00 USD"}
                  placeholderTextColor={dimText}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1,
                    borderColor: inputBorder,
                    borderRadius: 14,
                    padding: 14,
                    fontSize: 20,
                    fontWeight: "700",
                    marginBottom: 14,
                    color: textColor,
                  }}
                />

                {/* Convert button */}
                <TouchableOpacity
                  onPress={handleConvert}
                  style={{
                    backgroundColor: btnBg,
                    borderRadius: 14,
                    padding: 15,
                    alignItems: "center",
                    marginBottom: 14,
                    opacity: loading ? 0.6 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={btnText} />
                  ) : (
                    <Text
                      style={{
                        color: btnText,
                        fontWeight: "700",
                        fontSize: 16,
                        letterSpacing: 0.3,
                      }}
                    >
                      Convert
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Result */}
                {converted !== null && !loading && (
                  <View
                    style={{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: dimText,
                        fontWeight: "700",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Result
                    </Text>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "800",
                        color: textColor,
                        letterSpacing: -0.5,
                      }}
                    >
                      {converted.toFixed(2)}{" "}
                      <Text style={{ fontSize: 16, fontWeight: "600" }}>
                        {toUSD ? "USD" : currency}
                      </Text>
                    </Text>
                    <Text style={{ fontSize: 13, color: dimText, marginTop: 4 }}>
                      from {amount} {toUSD ? currency : "USD"}
                    </Text>
                  </View>
                )}

                {error && (
                  <Text
                    style={{
                      color: dimText,
                      marginTop: 10,
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    {error}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
