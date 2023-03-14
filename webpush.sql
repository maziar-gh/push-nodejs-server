-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 21, 2019 at 03:57 PM
-- Server version: 5.7.28-0ubuntu0.18.04.4-log
-- PHP Version: 7.2.24-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webpush`
--

-- --------------------------------------------------------

--
-- Table structure for table `camp`
--

CREATE TABLE `camp` (
  `id` int(11) NOT NULL,
  `title` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `site_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `camp_data`
--

CREATE TABLE `camp_data` (
  `id` int(11) NOT NULL,
  `camp_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(256) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `publicVapidKey` varchar(1000) DEFAULT NULL,
  `privateVapidKey` varchar(1000) DEFAULT NULL,
  `description` text,
  `created_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `name`, `publicVapidKey`, `privateVapidKey`, `description`, `created_at`) VALUES
(1, 'kal', 'BCoOwaaJi29-cO6ti_vj6RvhNOhvKL9mQnp4k3D9se3lfNUDDiL0HlF9Aw9PSWOGzRhH8GTucgK1p4VU0czUoTs', 'TfBm4kZMnR1ScIc1VV6xVwxKbn_D3AV3WaS1Kj0ZLYQ', 'cpass company', 1576596904),
(2, 'Bigapp', 'BJbQDxo63Bv3lb1jzMQpg5j5y3Iuog5j4JcVdUh_wBS3VEfd7lXL3T68axeZ3Dj0mfB9M39kMUzQOA842y764Oo', 'Q-k2J8FSKW0yQCa3kD-ofIpoO8GvKiOZ4a4G7IPfNTE', 'its cpass company', 1576596904),
(3, 'value wings enetrprise pvt ltd\r\n', 'BNJoG9JQE3YUPEJotjE5KC1hDaNmqB76hKJID6BoENz9CQrk9I0usjCPhX4UOdMBf2Rdo5ksxwRpouBEPLRZiNA', 'GJ11jTqoISMtCzVpDN5p8FukUq6UTTzFoMbzoBjM1hE', 'its job portal', 1576596904);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `subscription_key` varchar(5000) DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `browser` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `site_id`, `subscription_key`, `url`, `created_at`, `browser`) VALUES
(15, 1, '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/fcBtK2Ep8f0:APA91bGnqaHv2V4LaB0WpD-TFxLr9ICMWhSiR5rNKy5zbZnDbRq_B_AftGfdCyZy-2hdPhrsj3wiW-QtP1fM_EjBvTh9qsy-e4dMH6BMIbRskinYTz9XQOg1j2l9fuDOtjHaj8RWNZvO\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BH-GqimxcS01V18wk9b1ekWXQOaWOPvehw3Nn_lRWbSpG4GDQZmnQJJ6GtTgbO_rhUhn0Afi3w_5qwRowf5c1OQ\",\"auth\":\"8lAFubIxAjC97zd1c2EhTA\"}}', 'https://fcm.googleapis.com/fcm/send/fcBtK2Ep8f0:APA91bGnqaHv2V4LaB0WpD-TFxLr9ICMWhSiR5rNKy5zbZnDbRq_B_AftGfdCyZy-2hdPhrsj3wiW-QtP1fM_EjBvTh9qsy-e4dMH6BMIbRskinYTz9XQOg1j2l9fuDOtjHaj8RWNZvO', '2019-12-19 23:26:46', 'Mozilla'),
(17, 1, '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dovQDKE0Eag:APA91bEAN1OwjmG4kUJPRQKbygMKH1Noutd5a6kregRcP34LEg2REMEn0O7KTGKTTonYmqpnfMvCvkNpiqepVIegm3Z7jasZlWIBA1UvdQrueclQxaCHm9paBkcs3y1z6o55XxW9K3YA\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BOKR4FOACgZs5Zy8XWtg-JXzagrU-FVXd_9YiGJ9ss6SPihebip0NsxE14yAtCYxFInoRZwS-Jo63ovKlVmGRdg\",\"auth\":\"51eCFT-2fxGhEk4Sm0mqEg\"}}', 'https://fcm.googleapis.com/fcm/send/dovQDKE0Eag:APA91bEAN1OwjmG4kUJPRQKbygMKH1Noutd5a6kregRcP34LEg2REMEn0O7KTGKTTonYmqpnfMvCvkNpiqepVIegm3Z7jasZlWIBA1UvdQrueclQxaCHm9paBkcs3y1z6o55XxW9K3YA', '2019-12-21 11:19:52', 'Mozilla'),
(18, 2, '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/cECLo3fiuXg:APA91bHJ5BiJKe84uw17Dzga67p8yjyKg6RQi1XPj4aXjgvrLCjOhvSuRm18cMoyMY3LKMCb9u7IucRvpvf9-BU62CH51Gj0fePw__O5lAyVQprzgrEX-Hwtb2lIjrwxogdy_pfPoOHh\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BIYzYcChUHEw6EhSc85Ffo063HWE6GOubjXiB8RVr8Ezpn2wPcVNWlmlcPbbgiuLjJeMIbSRwQos9SXIv30k3JI\",\"auth\":\"MTpypkDnVQZIdLyQOceLmA\"}}', 'https://fcm.googleapis.com/fcm/send/cECLo3fiuXg:APA91bHJ5BiJKe84uw17Dzga67p8yjyKg6RQi1XPj4aXjgvrLCjOhvSuRm18cMoyMY3LKMCb9u7IucRvpvf9-BU62CH51Gj0fePw__O5lAyVQprzgrEX-Hwtb2lIjrwxogdy_pfPoOHh', '2019-12-21 14:59:01', 'Mozilla');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `camp`
--
ALTER TABLE `camp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `camp_data`
--
ALTER TABLE `camp_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `camp`
--
ALTER TABLE `camp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `camp_data`
--
ALTER TABLE `camp_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
