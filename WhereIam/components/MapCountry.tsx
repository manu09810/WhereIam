import { Modal, View, TouchableOpacity, Text, Linking } from "react-native";
import { XMarkIcon, GlobeAltIcon, MapIcon } from "react-native-heroicons/solid";
import MapView, { Marker } from "react-native-maps";

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
  // Validación robusta para evitar NaN y valores undefined/null
  const latNum =
    typeof latitude === "number" && !isNaN(latitude)
      ? latitude
      : latitude && !isNaN(Number(latitude))
      ? Number(latitude)
      : null;
  const lonNum =
    typeof longitude === "number" && !isNaN(longitude)
      ? longitude
      : longitude && !isNaN(Number(longitude))
      ? Number(longitude)
      : null;

  // Si no hay coordenadas válidas, no renderizar el mapa
  const showMap = latNum !== null && lonNum !== null;

  const openWikipedia = (query: string) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.log("Error opening Wikipedia:", err)
    );
  };

  const openGoogleMaps = (query: string) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(mapsUrl).catch((err) =>
      console.log("Error opening Google Maps:", err)
    );
  };

  // El mapa ocupará toda la pantalla del modal
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
        {showMap ? (
          <MapView
            style={{ flex: 1, width: "100%", height: "100%" }} // Cambia aquí
            initialRegion={{
              latitude: latNum,
              longitude: lonNum,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            <Marker
              coordinate={{ latitude: latNum, longitude: lonNum }}
              title={countryName}
              description={`${latNum}, ${lonNum}`}
            />
          </MapView>
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
