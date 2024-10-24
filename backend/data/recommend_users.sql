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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `preferences` longtext DEFAULT NULL,
  `viewed_items` longtext DEFAULT NULL,
  `wishlist_items` longtext DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bags',NULL,NULL),(2,'Laptops,PC,Computer,3D,Monitor','B002VQ0808,B079ZMR9QP,B0143UM4TC,B00TQU6ISS,B0C9SZ7DCR,B0C28T48LJ,B01HQ4KXZ4,B0CC3TT7XJ','B002VQ0808,B079ZMR9QP,B0C9SZ7DCR,B0143UM4TC,B00TQU6ISS'),(3,'boys',NULL,NULL),(4,'Pens, Pencils & Writing Supplies',NULL,'B000I5ZK2U,B007CX2HKE'),(5,'Pens, Pencils & Writing Supplies',NULL,'B002VQ0808'),(6,'School & Educational Supplies',NULL,NULL),(7,'Skin Care,Bath & Body,Beauty,Small Kitchen Appliances,Cookware,Kitchen Storage & Organisation',NULL,NULL),(8,'Computer Memory,Computer Screws,Laptops',NULL,NULL),(9,'Skin Care,Make-up,Beauty','B0B1JHVJHN','B08JL9KYBV'),(10,'Skin Care,Beauty,Make-up',NULL,'B0B1JHVJHN,B08JL9KYBV'),(11,'Skin Care,Make-up,Beauty',NULL,NULL),(12,'Skin Care,Make-up,Beauty',NULL,NULL),(13,'Skin Care,Make-up,Beauty',NULL,NULL),(14,'Skin Care,Make-up,Beauty',NULL,NULL),(15,'Skin Care,Make-up,Beauty',NULL,NULL),(16,'Skin Care,Make-up,Beauty,Kids\' Art & Craft Supplies,Kids\' Play Vehicles,Sports Toys & Outdoor','B0B1JHVJHN','B08JL9KYBV'),(17,'Skin Care,Make-up,Beauty,Small Kitchen Appliances,Kitchen Tools & Gadgets,Kitchen Storage & Organisation,Kitchen Linen,Handmade Home & Kitchen Products','B0B1JHVJHN','B08JL9KYBV'),(18,'Skin Care,Make-up,Beauty,Cookware,Small Kitchen Appliances,Kitchen Storage & Organisation','B0B1JHVJHN','B072VJVDVX'),(19,'Beauty','B0B1JHVJHN',NULL),(20,'PC & Video Games,Guitars & Gear',NULL,NULL),(21,'Beauty,Skin Care',NULL,'B00PBX3L7K');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
