import { Form } from "./form";
import styles from "./edit.module.scss";
export default function Edit() {
  return (
    <div className={styles.editdiv}>
      <h2 className={styles.editfood}>Edit food</h2>
      <Form></Form>
    </div>
  );
}
