import { StatusBar } from 'expo-status-bar';
import {SafeAreaView,StyleSheet,Text,View,FlatList} from 'react-native';

type Evenement= {
id: string;
titre: string;
catégorie: string;
capacité: number;
inscrits: number;
};

const evenements: Evenement[] = [
 { id: 'E01', titre: 'Atelier React', catégorie: 'Atelier', capacité: 25, inscrits: 25 },
 { id: 'E02', titre: 'Conférence IA', catégorie: 'Conférence', capacité: 70, inscrits: 52 },
 { id: 'E03', titre: 'Sécurité mobile', catégorie: 'Atelier', capacité: 20, inscrits: 17 },
 { id: 'E04', titre: 'Design UI', catégorie: 'Atelier', capacité: 18, inscrits: 9 },
 { id: 'E05', titre: 'Forum projets', catégorie: 'Rencontre', capacité: 50, inscrits: 49 },
 { id: 'E06', titre: 'Découverte Git', catégorie: 'Atelier', capacité: 24, inscrits: 24 },
 ];

const placesRestantes = (e: Evenement) => {
  return Math.max(0, e.capacité - e.inscrits);
};



const statutEvenement = (e: Evenement) => {
  const r = placesRestantes(e);

  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
};

const mode: 'tous' | 'ateliers' = 'tous';

const evenementsAffiches =
  mode === 'tous'
    ? evenements
    : evenements.filter(
        (e) =>
          e.catégorie === 'Atelier' &&
          placesRestantes(e) > 0
      );

const totalEvenements = evenements.length;
const evenementsComplets = evenements.filter((e) => placesRestantes(e) === 0).length;
const evenementsAvecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlacesRestantes = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

const ateliersDisponibles = evenements.filter(
  (e) => e.catégorie === 'Atelier' && placesRestantes(e) > 0
);

type BadgeProps = { statut: string };
const BadgeEtat = ({ statut }: BadgeProps) => {
  let couleurBg = '#e0e0e0'; 
  if (statut === 'Complet') couleurBg = '#f86363'; 
  else if (statut === 'Presque complet') couleurBg = '#f3c16c';
  else if (statut === 'Ouvert') couleurBg = '#69ec69'; 

  return (
    <View style={{ backgroundColor: couleurBg, padding: 5, borderRadius: 5, alignSelf: 'flex-start' }}>
      <Text>{statut}</Text>
    </View>
  );
};

type CarteProps = { evenement: Evenement };
export const CarteEvenement = ({ evenement }: CarteProps) => {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);
  


  return (
    <View style={styles.carte}>
      <Text style={styles.titre}>{evenement.titre}</Text>
      <Text>{evenement.catégorie}</Text>
      <Text>{places} places restantes</Text>
      <BadgeEtat statut={statut} /> 
    </View>
  );
};

type BlocProps = { libelle: string; nombre: number };
export const BlocStatistique = ({ libelle, nombre }: BlocProps) => {
  return (
    <View style={styles.bloc}>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.libelle}>{libelle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  carte: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  titre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
bloc: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
    minWidth: 100,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  libelle: {
    fontSize: 12,
    color: '#666',
}});

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListHeaderComponent={
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
              CampusAgenda
            </Text>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Événements du campus
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginVertical: 15
            }}>
              <BlocStatistique
                libelle="Total événements"
                nombre={totalEvenements}
              />
              <BlocStatistique
                libelle="Événements complets"
                nombre={evenementsComplets}
              />
              <BlocStatistique
                libelle="Événements disponibles"
                nombre={evenementsAvecPlaces}
              />
              <BlocStatistique
                libelle="Places restantes"
                nombre={totalPlacesRestantes}
              />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
            </Text>
          </View>
        }

        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30 }}>
            Aucun événement disponible.
          </Text>
        }

        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </SafeAreaView>
  );
};
export default App; 

