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
        `https://juanmalorenzo.com/api/${from}/${to}/${amount}`,
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
              backgroundColor: themeColors?.[0] || "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              minHeight: 320,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: "#1a1a1a" }}
              >
                Currency Converter
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: 50,
                  padding: 8,
                }}
              >
                <XMarkIcon size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <ActivityIndicator size="large" color="#1a1a1a" />
              </View>
            ) : !currencyExists ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "#1a1a1a",
                    textAlign: "center",
                  }}
                >
                  Not available in this region on the MVP
                </Text>
              </View>
            ) : (
              <>
                {/* Switch button */}
                <View style={{ alignItems: "center", marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={handleSwitch}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: themeColors?.[1] || "#f0f0f0",
                      borderRadius: 20,
                      paddingVertical: 6,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        marginRight: 8,
                        color: "#1a1a1a",
                      }}
                    >
                      {toUSD ? `${currency} → USD` : `USD → ${currency}`}
                    </Text>
                    <ArrowsRightLeftIcon size={20} color="#1a1a1a" />
                  </TouchableOpacity>
                </View>

                {/* Input */}
                <Text
                  style={{ fontSize: 16, color: "#1a1a1a", marginBottom: 8 }}
                >
                  {toUSD
                    ? `Convert from ${currency} to USD`
                    : `Convert from USD to ${currency}`}
                </Text>
                <TextInput
                  placeholder={
                    toUSD ? `Amount in ${currency}` : "Amount in USD"
                  }
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 18,
                    marginBottom: 16,
                    backgroundColor: "#fff",
                    color: "#1a1a1a",
                  }}
                />

                <TouchableOpacity
                  onPress={handleConvert}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 14,
                    alignItems: "center",
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#1a1a1a",
                  }}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: "#1a1a1a",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    Convert
                  </Text>
                </TouchableOpacity>

                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#1a1a1a"
                    style={{ marginBottom: 12 }}
                  />
                )}

                {converted !== null && !loading && (
                  <View style={{ alignItems: "center", marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, color: "#1a1a1a" }}>
                      {amount} {toUSD ? currency : "USD"} ≈{" "}
                      {converted.toFixed(2)} {toUSD ? "USD" : currency}
                    </Text>
                  </View>
                )}

                {error && (
                  <Text
                    style={{
                      color: "#1a1a1a",
                      marginTop: 8,
                      textAlign: "center",
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
