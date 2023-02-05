export default function({ store, redirect }) {
    if (store.getters.getCompletedStatus.length < 6) {
      return redirect("/category");
    }
  }