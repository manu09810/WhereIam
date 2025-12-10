import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import { XMarkIcon, GlobeAltIcon, MapIcon } from "react-native-heroicons/solid";

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  countryName: string;
}

export const MapModal = ({
  visible,
  onClose,
  latitude,
  longitude,
  countryName,
}: MapModalProps) => {
  const latNum = parseFloat(String(latitude));
  const lonNum = parseFloat(String(longitude));

  const openWikipedia = (query) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.log("Error opening Wikipedia:", err)
    );
  };

  const openGoogleMaps = (query) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(mapsUrl).catch((err) =>
      console.log("Error opening Google Maps:", err)
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {latNum && lonNum ? (
          <Image
            source={{
              uri: `https://tile.openstreetmap.de/tiles/osmde/4/${Math.floor(
                ((lonNum + 180) / 360) * Math.pow(2, 4)
              )}/${Math.floor(
                ((1 -
                  Math.log(
                    Math.tan((latNum * Math.PI) / 180) +
                      1 / Math.cos((latNum * Math.PI) / 180)
                  ) /
                    Math.PI) /
                  2) *
                  Math.pow(2, 4)
              )}.png`,
            }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ fontSize: 48, color: "#fff" }}>📍</Text>
        )}

        {/* Action Buttons */}
        <View
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            flexDirection: "row",
            gap: 12,
          }}
        >
          {/* Wikipedia Button */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              openWikipedia(countryName);
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: 12,
            }}
          >
            <GlobeAltIcon size={24} color="#1a1a1a" />
          </TouchableOpacity>

          {/* Google Maps Button */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              openGoogleMaps(countryName);
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: 12,
            }}
          >
            <MapIcon size={24} color="#1a1a1a" />
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: 12,
            }}
          >
            <XMarkIcon size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
