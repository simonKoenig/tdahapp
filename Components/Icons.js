import { MaterialCommunityIcons } from "@expo/vector-icons";



export const HomeIcon = ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />;

export const ChartBarIcon = ({ color, size }) => <MaterialCommunityIcons name="chart-bar" color={color} size={size} />;


export const GiftIcon = ({ color, size }) => <MaterialCommunityIcons name="gift" color={color} size={size} />;


export const SearchIcon = ({ color, size }) => <MaterialCommunityIcons name="magnify" color={color} size={size} accessible={false} // Marcar el ícono como no accesible para los lectores de pantalla
    importantForAccessibility="no" />;

export const AccountIcon = ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />;

export const SubjectIcon = ({ color, size }) => <MaterialCommunityIcons name="book" color={color} size={size} />;

export const DeleteIcon = ({ color, size }) => <MaterialCommunityIcons name="delete" color={color} size={size} />;

export const QrIcon = ({ color, size }) => <MaterialCommunityIcons name="qrcode" color={color} size={size} />;

export const MessageIcon = ({ color, size }) => <MaterialCommunityIcons name="message" color={color} size={size} />;

export const EyeIcon = ({ color, size }) => <MaterialCommunityIcons name="eye-outline" color={color} size={size} />;

export const EyeOffIcon = ({ color, size }) => <MaterialCommunityIcons name="eye-off-outline" color={color} size={size} />;
