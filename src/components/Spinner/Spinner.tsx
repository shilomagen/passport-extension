import styles from './Spinner.scss';
import React , { FunctionComponent } from 'react';
 const Spinner: FunctionComponent = () => {
     return (
         <div className={styles.container}>
                    <div className={styles.title}><span className={styles["dot-elastic"]}></span> </div>
                    <div className={styles.spinner}></div>
         </div>
     );
 }

 export default Spinner;