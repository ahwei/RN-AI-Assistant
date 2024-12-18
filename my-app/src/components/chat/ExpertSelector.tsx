import { Expert } from '@/types/expert';
import { Avatar } from '@rneui/themed';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExpertSelectorProps {
  experts: Expert[];
  selectedExperts: number[];
  onSelectExpert: (id: number) => void;
}

const ExpertSelector: React.FC<ExpertSelectorProps> = ({
  experts,
  selectedExperts,
  onSelectExpert,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Expert</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {experts.map(expert => (
          <View
            key={expert.expert_id}
            style={[
              styles.expertItem,
              selectedExperts.includes(expert.expert_id) && styles.selectedExpert,
            ]}
          >
            <TouchableOpacity
              onPress={() => onSelectExpert(expert.expert_id)}
              onLongPress={() =>
                Alert.alert(
                  expert.name,
                  `About ${expert.name}: ${expert.description ?? 'No description'}`
                )
              }
              style={styles.touchable}
            >
              <Avatar size={50} rounded source={{ uri: 'https://i.pravatar.cc/100' }} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  expertItem: {
    alignItems: 'center',
    borderRadius: 30,
    marginRight: 1,
    padding: 1,
  },
  scrollContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  selectedExpert: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  touchable: {
    opacity: 1,
  },
});

export default ExpertSelector;
