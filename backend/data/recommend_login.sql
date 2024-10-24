-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: recommend
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `login_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,1,'Thilina','$2b$12$Yh/fsjtEM2N7DuDUkFsSGeT.ZX5PejMmjI8HOgrZW0U3QxzpuEIRa'),(2,2,'kalana','$2b$12$TBcvhJ1sP3pVNfoDv3BieeUJN5G7Y4I4.PPshnndeDK0DM4Y5DlFu'),(3,3,'thilina','$2b$12$8Lr3MGOc0agSMP.485XDPO03ak0MPxO7VqcgTjBK/lBfUXamkiDQe'),(4,4,'kanjana','$2b$12$E.Hz1oc7YoDFJaLoNdLn/OEri5U2FK0OWk4/6F84.rLfet1yGn1iu'),(5,5,'ushan','$2b$12$Hf7CuRr1N.vPIVqfUlCTIO36k0.6.LKabOMTkhhRn7IeNI1T8cW5W'),(6,6,'martin','$2b$12$UmSiymuO2WvMwDcSXHCX4.UJ6xAdnxbk3/7ugUNxTLSy8UiK3Yzve'),(7,7,'panchali','$2b$12$ny/yoQTrYhSoEP7weVXiXubqZ8W/wSaFin6Aq2ANMF.H4W2DzuLIa'),(8,8,'aloka','$2b$12$8QIXrFVnWZmVZc0ypmmQx.F.ex2yo5OuFU3k6LDOlDRxTjUYnSa9K'),(9,9,'kamala','$2b$12$FBmyvPyWfmXdhzUU3WLETOjyoV.CoW4LfVOKro2HA3xqr/l.WocIi'),(10,10,'udani','$2b$12$O8s5UZ/eNV3sMRueu7whv.aPGm4kEa7aVWbWWbX8jnTT6JqbDNVX2'),(11,11,'udani','$2b$12$fYgC3bxbc4AkVXBFBwU6sO.CzvJoGTtiVw1Y7IeECz7s12Nzqr9je'),(12,12,'dusahani','$2b$12$g9to.Mn8LtEFxZBp/RCrVekWFNVndbycnocJUj0.DiXGWP9MMcfba'),(13,13,'savini','$2b$12$5L9hdSZCbAC0QFCPVpwGS.zcPYUd0m1EhLm.d3ENputCsIqreBkie'),(14,14,'savini','$2b$12$HLFR.9y3pmM3LAKbY1WH6edcfO3rfmF0swvVK1cKTP8f06Dmrn5KO'),(15,15,'shavini','$2b$12$U.H5XIMXm.YovbbjpNk/Du5.dh4rH1cjQ./Nb/afLjRkTmBsdjFE.'),(16,16,'mala','$2b$12$CoA2TY6o/7QqCcFKXwoRrurfB/Jdemmin8C6lvOu4YoHETj5Mxlpm'),(17,17,'dushani','$2b$12$jo2X2iK6uErOIcJqZPRT9.QUkAviiDHImwLqSA2quhz5A0qTMsr.q'),(18,18,'nayani','$2b$12$zPErfYr2DLxwvzfryiaXIevrs9kt4AZ8AtMJ3rCDAhsWozCSkpElG'),(19,19,'nimsara','$2b$12$QhhxfNFAg0WuejU9cPBKM.AmdNXKAIKabHzkG2JlWY.PVaveuthFm'),(20,20,'oshada','$2b$12$kXI9D8a.TT5GI0hsVqMFROKMZDsAdaKF/2LjtCb.ugQ3ZsVZuBDAy'),(21,21,'girl','$2b$12$MlQLZll3H8EH5Q9gri8Rx./6J0BJYZBSY8gTZ36Qp7kLcDMOnCrvm');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-24 15:04:22
