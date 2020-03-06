-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 11, 2019 at 04:10 PM
-- Server version: 10.2.26-MariaDB
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `otoka112_logs`
--
-- CREATE DATABASE IF NOT EXISTS `otoka112_logs` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- USE `otoka112_logs`;

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `LogId` binary(16) NOT NULL,
  `IP` int(11) UNSIGNED NOT NULL,
  `LastTime` datetime NOT NULL,
  `Count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Logs`
--

CREATE TABLE `Logs` (
  `Id` binary(16) NOT NULL,
  `TypeId` int(11) NOT NULL,
  `StatusId` int(11) NOT NULL,
  `AppName` varchar(50) NOT NULL,
  `AppVersion` varchar(50) NOT NULL,
  `MessageShort` text NOT NULL,
  `MessageFull` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Statuses`
--

CREATE TABLE `Statuses` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Statuses`
--

INSERT INTO `Statuses` (`Id`, `Name`) VALUES
(0, 'New'),
(1, 'Fixed'),
(2, 'Old'),
(3, 'Server Error'),
(4, 'Client Error'),
(5, 'Info'),
(6, 'Development'),
(7, 'Bad Connection'),
(8, 'Duplicate'),
(9, 'Not Implemented'),
(10, 'User Error');

-- --------------------------------------------------------

--
-- Table structure for table `Types`
--

CREATE TABLE `Types` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Types`
--

INSERT INTO `Types` (`Id`, `Name`) VALUES
(4, 'Action'),
(2, 'Debug'),
(8, 'Error'),
(9, 'Fatal'),
(3, 'Info'),
(0, 'None'),
(1, 'Trace'),
(6, 'UserError'),
(5, 'UserWarning'),
(7, 'Warning');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD UNIQUE KEY `LogId_IP` (`LogId`,`IP`),
  ADD KEY `LastTime` (`LastTime`),
  ADD KEY `Count` (`Count`);

--
-- Indexes for table `Logs`
--
ALTER TABLE `Logs`
  ADD UNIQUE KEY `Id` (`Id`),
  ADD KEY `AppName` (`AppName`),
  ADD KEY `AppVersion` (`AppVersion`),
  ADD KEY `Status` (`StatusId`);

--
-- Indexes for table `Statuses`
--
ALTER TABLE `Statuses`
  ADD UNIQUE KEY `Id` (`Id`);

--
-- Indexes for table `Types`
--
ALTER TABLE `Types`
  ADD UNIQUE KEY `Id` (`Id`),
  ADD KEY `Name` (`Name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
