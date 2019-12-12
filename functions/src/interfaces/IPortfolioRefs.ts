export default interface IPortfolioRefs {
  category: FirebaseFirestore.DocumentReference[];
  project: FirebaseFirestore.DocumentReference[];
  technology: FirebaseFirestore.DocumentReference[];
  component: FirebaseFirestore.DocumentReference[];
}
