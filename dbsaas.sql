CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Actividades` (
    `IdActividad` int NOT NULL AUTO_INCREMENT,
    `NombreActividad` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Actividades` PRIMARY KEY (`IdActividad`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Certificados` (
    `IdCertificado` int NOT NULL AUTO_INCREMENT,
    `NombreCertificacion` longtext CHARACTER SET utf8mb4 NOT NULL,
    `EnteEmisor` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Verificado` tinyint(1) NOT NULL,
    `FechaEmision` datetime(6) NOT NULL,
    CONSTRAINT `PK_Certificados` PRIMARY KEY (`IdCertificado`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Descuentos` (
    `IdDescuento` int NOT NULL AUTO_INCREMENT,
    `Caso` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Valor` double NOT NULL,
    CONSTRAINT `PK_Descuentos` PRIMARY KEY (`IdDescuento`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Equipos` (
    `IdEquipo` int NOT NULL AUTO_INCREMENT,
    `Nombre` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Equipos` PRIMARY KEY (`IdEquipo`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Recibos` (
    `IdRecibo` int NOT NULL AUTO_INCREMENT,
    `Fecha` datetime(6) NOT NULL,
    `Monto` double NOT NULL,
    CONSTRAINT `PK_Recibos` PRIMARY KEY (`IdRecibo`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Reglamentos` (
    `IdReglamento` int NOT NULL AUTO_INCREMENT,
    `TipoReglamento` longtext CHARACTER SET utf8mb4 NOT NULL,
    `PuntosPorVictoria` int NOT NULL,
    `PuntosPorEmpate` int NOT NULL,
    `MaximaFaltasPorJugador` int NOT NULL,
    `CantidadCambios` int NOT NULL,
    CONSTRAINT `PK_Reglamentos` PRIMARY KEY (`IdReglamento`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `TipoCanchas` (
    `IdTipoCancha` int NOT NULL AUTO_INCREMENT,
    `Nombre` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Superficie` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Capacidad` int NOT NULL,
    `Precio` double NOT NULL,
    CONSTRAINT `PK_TipoCanchas` PRIMARY KEY (`IdTipoCancha`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Usuarios` (
    `Dni` int NOT NULL,
    `Nombre` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Apellido` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Telefono` int NOT NULL,
    `Mail` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Contrasena` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Usuarios` PRIMARY KEY (`Dni`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Cobros` (
    `IdCobro` int NOT NULL AUTO_INCREMENT,
    `Fecha` datetime(6) NOT NULL,
    `MontoBase` double NOT NULL,
    `Concepto` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `Estado` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `MontoFinal` double NOT NULL,
    `IdDescuento` int NULL,
    `IdRecibo` int NULL,
    CONSTRAINT `PK_Cobros` PRIMARY KEY (`IdCobro`),
    CONSTRAINT `FK_Cobros_Descuentos_IdDescuento` FOREIGN KEY (`IdDescuento`) REFERENCES `Descuentos` (`IdDescuento`),
    CONSTRAINT `FK_Cobros_Recibos_IdRecibo` FOREIGN KEY (`IdRecibo`) REFERENCES `Recibos` (`IdRecibo`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Competiciones` (
    `IdActividad` int NOT NULL,
    `IdReglamento` int NOT NULL,
    CONSTRAINT `PK_Competiciones` PRIMARY KEY (`IdActividad`),
    CONSTRAINT `FK_Competiciones_Actividades_IdActividad` FOREIGN KEY (`IdActividad`) REFERENCES `Actividades` (`IdActividad`) ON DELETE CASCADE,
    CONSTRAINT `FK_Competiciones_Reglamentos_IdReglamento` FOREIGN KEY (`IdReglamento`) REFERENCES `Reglamentos` (`IdReglamento`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Canchas` (
    `IdCancha` int NOT NULL AUTO_INCREMENT,
    `IdTipoCancha` int NOT NULL,
    `DiasHabiles` longtext CHARACTER SET utf8mb4 NOT NULL,
    `HoraInicio` time(6) NOT NULL,
    `HoraFin` time(6) NOT NULL,
    `DuracionMaxima` int NOT NULL,
    `Disponible` tinyint(1) NOT NULL,
    CONSTRAINT `PK_Canchas` PRIMARY KEY (`IdCancha`),
    CONSTRAINT `FK_Canchas_TipoCanchas_IdTipoCancha` FOREIGN KEY (`IdTipoCancha`) REFERENCES `TipoCanchas` (`IdTipoCancha`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Administradores` (
    `Dni` int NOT NULL,
    CONSTRAINT `PK_Administradores` PRIMARY KEY (`Dni`),
    CONSTRAINT `FK_Administradores_Usuarios_Dni` FOREIGN KEY (`Dni`) REFERENCES `Usuarios` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Clientes` (
    `Dni` int NOT NULL,
    `EsSocio` tinyint(1) NOT NULL,
    CONSTRAINT `PK_Clientes` PRIMARY KEY (`Dni`),
    CONSTRAINT `FK_Clientes_Usuarios_Dni` FOREIGN KEY (`Dni`) REFERENCES `Usuarios` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Direcciones` (
    `IdDireccion` int NOT NULL AUTO_INCREMENT,
    `Calle` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Numero` int NOT NULL,
    `Localidad` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Barrio` longtext CHARACTER SET utf8mb4 NOT NULL,
    `CodigoPostal` int NOT NULL,
    `DniUsuario` int NOT NULL,
    CONSTRAINT `PK_Direcciones` PRIMARY KEY (`IdDireccion`),
    CONSTRAINT `FK_Direcciones_Usuarios_DniUsuario` FOREIGN KEY (`DniUsuario`) REFERENCES `Usuarios` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Instructores` (
    `Dni` int NOT NULL,
    `Especialidad` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Antiguedad` int NOT NULL,
    `IdCertificado` int NULL,
    CONSTRAINT `PK_Instructores` PRIMARY KEY (`Dni`),
    CONSTRAINT `FK_Instructores_Certificados_IdCertificado` FOREIGN KEY (`IdCertificado`) REFERENCES `Certificados` (`IdCertificado`),
    CONSTRAINT `FK_Instructores_Usuarios_Dni` FOREIGN KEY (`Dni`) REFERENCES `Usuarios` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `CompeticionEquipo` (
    `CompeticionesIdActividad` int NOT NULL,
    `EquiposIdEquipo` int NOT NULL,
    CONSTRAINT `PK_CompeticionEquipo` PRIMARY KEY (`CompeticionesIdActividad`, `EquiposIdEquipo`),
    CONSTRAINT `FK_CompeticionEquipo_Competiciones_CompeticionesIdActividad` FOREIGN KEY (`CompeticionesIdActividad`) REFERENCES `Competiciones` (`IdActividad`) ON DELETE CASCADE,
    CONSTRAINT `FK_CompeticionEquipo_Equipos_EquiposIdEquipo` FOREIGN KEY (`EquiposIdEquipo`) REFERENCES `Equipos` (`IdEquipo`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Ligas` (
    `IdActividad` int NOT NULL,
    CONSTRAINT `PK_Ligas` PRIMARY KEY (`IdActividad`),
    CONSTRAINT `FK_Ligas_Competiciones_IdActividad` FOREIGN KEY (`IdActividad`) REFERENCES `Competiciones` (`IdActividad`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Torneos` (
    `IdActividad` int NOT NULL,
    CONSTRAINT `PK_Torneos` PRIMARY KEY (`IdActividad`),
    CONSTRAINT `FK_Torneos_Competiciones_IdActividad` FOREIGN KEY (`IdActividad`) REFERENCES `Competiciones` (`IdActividad`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `ClienteEquipo` (
    `EquipoIdEquipo` int NOT NULL,
    `JugadoresDni` int NOT NULL,
    CONSTRAINT `PK_ClienteEquipo` PRIMARY KEY (`EquipoIdEquipo`, `JugadoresDni`),
    CONSTRAINT `FK_ClienteEquipo_Clientes_JugadoresDni` FOREIGN KEY (`JugadoresDni`) REFERENCES `Clientes` (`Dni`) ON DELETE CASCADE,
    CONSTRAINT `FK_ClienteEquipo_Equipos_EquipoIdEquipo` FOREIGN KEY (`EquipoIdEquipo`) REFERENCES `Equipos` (`IdEquipo`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Reservas` (
    `IdReserva` int NOT NULL AUTO_INCREMENT,
    `Fecha` datetime(6) NOT NULL,
    `HoraInicio` time(6) NOT NULL,
    `HoraFin` time(6) NOT NULL,
    `EstadoReserva` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `DniCliente` int NOT NULL,
    `IdCancha` int NOT NULL,
    `IdCobro` int NULL,
    CONSTRAINT `PK_Reservas` PRIMARY KEY (`IdReserva`),
    CONSTRAINT `FK_Reservas_Canchas_IdCancha` FOREIGN KEY (`IdCancha`) REFERENCES `Canchas` (`IdCancha`) ON DELETE CASCADE,
    CONSTRAINT `FK_Reservas_Clientes_DniCliente` FOREIGN KEY (`DniCliente`) REFERENCES `Clientes` (`Dni`) ON DELETE CASCADE,
    CONSTRAINT `FK_Reservas_Cobros_IdCobro` FOREIGN KEY (`IdCobro`) REFERENCES `Cobros` (`IdCobro`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Entrenadores` (
    `Dni` int NOT NULL,
    CONSTRAINT `PK_Entrenadores` PRIMARY KEY (`Dni`),
    CONSTRAINT `FK_Entrenadores_Instructores_Dni` FOREIGN KEY (`Dni`) REFERENCES `Instructores` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Profesores` (
    `Dni` int NOT NULL,
    CONSTRAINT `PK_Profesores` PRIMARY KEY (`Dni`),
    CONSTRAINT `FK_Profesores_Instructores_Dni` FOREIGN KEY (`Dni`) REFERENCES `Instructores` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Fecha` (
    `IdFecha` int NOT NULL AUTO_INCREMENT,
    `NumeroFecha` int NOT NULL,
    `EstaFinalizada` tinyint(1) NOT NULL,
    `IdLiga` int NOT NULL,
    CONSTRAINT `PK_Fecha` PRIMARY KEY (`IdFecha`),
    CONSTRAINT `FK_Fecha_Ligas_IdLiga` FOREIGN KEY (`IdLiga`) REFERENCES `Ligas` (`IdActividad`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `RegistroTabla` (
    `IdTabla` int NOT NULL AUTO_INCREMENT,
    `Posicion` int NOT NULL,
    `IdLiga` int NOT NULL,
    `IdEquipo` int NOT NULL,
    `Puntos` int NOT NULL,
    `GolesFavor` int NOT NULL,
    `GolesContra` int NOT NULL,
    CONSTRAINT `PK_RegistroTabla` PRIMARY KEY (`IdTabla`),
    CONSTRAINT `FK_RegistroTabla_Equipos_IdEquipo` FOREIGN KEY (`IdEquipo`) REFERENCES `Equipos` (`IdEquipo`) ON DELETE CASCADE,
    CONSTRAINT `FK_RegistroTabla_Ligas_IdLiga` FOREIGN KEY (`IdLiga`) REFERENCES `Ligas` (`IdActividad`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Entrenamientos` (
    `IdActividad` int NOT NULL,
    `Descripcion` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `DniEntrenador` int NOT NULL,
    CONSTRAINT `PK_Entrenamientos` PRIMARY KEY (`IdActividad`),
    CONSTRAINT `FK_Entrenamientos_Actividades_IdActividad` FOREIGN KEY (`IdActividad`) REFERENCES `Actividades` (`IdActividad`) ON DELETE CASCADE,
    CONSTRAINT `FK_Entrenamientos_Entrenadores_DniEntrenador` FOREIGN KEY (`DniEntrenador`) REFERENCES `Entrenadores` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Clases` (
    `IdActividad` int NOT NULL,
    `CupoMaximo` int NOT NULL,
    `DniProfesor` int NOT NULL,
    CONSTRAINT `PK_Clases` PRIMARY KEY (`IdActividad`),
    CONSTRAINT `FK_Clases_Actividades_IdActividad` FOREIGN KEY (`IdActividad`) REFERENCES `Actividades` (`IdActividad`) ON DELETE CASCADE,
    CONSTRAINT `FK_Clases_Profesores_DniProfesor` FOREIGN KEY (`DniProfesor`) REFERENCES `Profesores` (`Dni`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Partidos` (
    `IdPartido` int NOT NULL AUTO_INCREMENT,
    `IdEquipoLocal` int NOT NULL,
    `IdEquipoVisitante` int NOT NULL,
    `IdCancha` int NULL,
    `IdFecha` int NULL,
    `IdTorneo` int NULL,
    `GolesLocal` int NOT NULL,
    `GolesVisitante` int NOT NULL,
    `Estado` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Partidos` PRIMARY KEY (`IdPartido`),
    CONSTRAINT `FK_Partidos_Canchas_IdCancha` FOREIGN KEY (`IdCancha`) REFERENCES `Canchas` (`IdCancha`),
    CONSTRAINT `FK_Partidos_Equipos_IdEquipoLocal` FOREIGN KEY (`IdEquipoLocal`) REFERENCES `Equipos` (`IdEquipo`) ON DELETE CASCADE,
    CONSTRAINT `FK_Partidos_Equipos_IdEquipoVisitante` FOREIGN KEY (`IdEquipoVisitante`) REFERENCES `Equipos` (`IdEquipo`) ON DELETE CASCADE,
    CONSTRAINT `FK_Partidos_Fecha_IdFecha` FOREIGN KEY (`IdFecha`) REFERENCES `Fecha` (`IdFecha`),
    CONSTRAINT `FK_Partidos_Torneos_IdTorneo` FOREIGN KEY (`IdTorneo`) REFERENCES `Torneos` (`IdActividad`)
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Canchas_IdTipoCancha` ON `Canchas` (`IdTipoCancha`);

CREATE INDEX `IX_Clases_DniProfesor` ON `Clases` (`DniProfesor`);

CREATE INDEX `IX_ClienteEquipo_JugadoresDni` ON `ClienteEquipo` (`JugadoresDni`);

CREATE INDEX `IX_Cobros_IdDescuento` ON `Cobros` (`IdDescuento`);

CREATE INDEX `IX_Cobros_IdRecibo` ON `Cobros` (`IdRecibo`);

CREATE INDEX `IX_CompeticionEquipo_EquiposIdEquipo` ON `CompeticionEquipo` (`EquiposIdEquipo`);

CREATE INDEX `IX_Competiciones_IdReglamento` ON `Competiciones` (`IdReglamento`);

CREATE UNIQUE INDEX `IX_Direcciones_DniUsuario` ON `Direcciones` (`DniUsuario`);

CREATE INDEX `IX_Entrenamientos_DniEntrenador` ON `Entrenamientos` (`DniEntrenador`);

CREATE INDEX `IX_Fecha_IdLiga` ON `Fecha` (`IdLiga`);

CREATE INDEX `IX_Instructores_IdCertificado` ON `Instructores` (`IdCertificado`);

CREATE INDEX `IX_Partidos_IdCancha` ON `Partidos` (`IdCancha`);

CREATE INDEX `IX_Partidos_IdEquipoLocal` ON `Partidos` (`IdEquipoLocal`);

CREATE INDEX `IX_Partidos_IdEquipoVisitante` ON `Partidos` (`IdEquipoVisitante`);

CREATE INDEX `IX_Partidos_IdFecha` ON `Partidos` (`IdFecha`);

CREATE INDEX `IX_Partidos_IdTorneo` ON `Partidos` (`IdTorneo`);

CREATE INDEX `IX_RegistroTabla_IdEquipo` ON `RegistroTabla` (`IdEquipo`);

CREATE INDEX `IX_RegistroTabla_IdLiga` ON `RegistroTabla` (`IdLiga`);

CREATE INDEX `IX_Reservas_DniCliente` ON `Reservas` (`DniCliente`);

CREATE INDEX `IX_Reservas_IdCancha` ON `Reservas` (`IdCancha`);

CREATE INDEX `IX_Reservas_IdCobro` ON `Reservas` (`IdCobro`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260515040210_MigracionInicial', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Canchas` ADD `Capacidad` int NOT NULL DEFAULT 0;

ALTER TABLE `Canchas` ADD `Superficie` longtext CHARACTER SET utf8mb4 NOT NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260522224005_AgregaSuperficieYCapacidad', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Reservas` ADD `ComprobantePath` longtext NOT NULL;

ALTER TABLE `Ligas` ADD `CupoMaximo` int NOT NULL DEFAULT 0;

ALTER TABLE `Clientes` ADD `ClaseIdActividad` int NULL;

CREATE INDEX `IX_Clientes_ClaseIdActividad` ON `Clientes` (`ClaseIdActividad`);

ALTER TABLE `Clientes` ADD CONSTRAINT `FK_Clientes_Clases_ClaseIdActividad` FOREIGN KEY (`ClaseIdActividad`) REFERENCES `Clases` (`IdActividad`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260530155209_FusionModulosCompanera', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Canchas` DROP COLUMN `Capacidad`;

ALTER TABLE `Canchas` DROP COLUMN `Superficie`;

ALTER TABLE `TipoCanchas` MODIFY COLUMN `IdTipoCancha` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Reservas` MODIFY COLUMN `IdReserva` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Reglamentos` MODIFY COLUMN `IdReglamento` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `RegistroTabla` MODIFY COLUMN `IdTabla` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Recibos` MODIFY COLUMN `IdRecibo` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Partidos` MODIFY COLUMN `IdPartido` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Fecha` MODIFY COLUMN `IdFecha` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Equipos` MODIFY COLUMN `IdEquipo` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Direcciones` MODIFY COLUMN `IdDireccion` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Descuentos` MODIFY COLUMN `IdDescuento` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Cobros` MODIFY COLUMN `IdCobro` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Certificados` MODIFY COLUMN `IdCertificado` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Canchas` MODIFY COLUMN `IdCancha` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `Actividades` MODIFY COLUMN `IdActividad` int NOT NULL AUTO_INCREMENT;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260530171759_NormalizacionCanchas', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Reservas` DROP FOREIGN KEY `FK_Reservas_Clientes_DniCliente`;

ALTER TABLE `Reservas` MODIFY COLUMN `ComprobantePath` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Reservas` ADD CONSTRAINT `FK_Reservas_Usuarios_DniCliente` FOREIGN KEY (`DniCliente`) REFERENCES `Usuarios` (`Dni`) ON DELETE CASCADE;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260530195904_FixReservaFKUsuario', '8.0.11');

COMMIT;

START TRANSACTION;

UPDATE `Reservas` SET `ComprobantePath` = ''
WHERE `ComprobantePath` IS NULL;
SELECT ROW_COUNT();


ALTER TABLE `Reservas` MODIFY COLUMN `ComprobantePath` longtext CHARACTER SET utf8mb4 NOT NULL;

ALTER TABLE `Reservas` ADD `FechaCreacion` datetime(6) NOT NULL DEFAULT '0001-01-01 00:00:00';

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531052718_Regla10Minutos', '8.0.11');

COMMIT;

START TRANSACTION;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531185402_SegundaFusionMica', '8.0.11');

COMMIT;

START TRANSACTION;

DROP TABLE `ClienteEquipo`;

CREATE TABLE `Jugadores` (
    `IdJugador` int NOT NULL AUTO_INCREMENT,
    `IdEquipo` int NOT NULL,
    `DniUsuario` int NULL,
    `NombreInvitado` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Dorsal` int NULL,
    CONSTRAINT `PK_Jugadores` PRIMARY KEY (`IdJugador`),
    CONSTRAINT `FK_Jugadores_Equipos_IdEquipo` FOREIGN KEY (`IdEquipo`) REFERENCES `Equipos` (`IdEquipo`) ON DELETE CASCADE,
    CONSTRAINT `FK_Jugadores_Usuarios_DniUsuario` FOREIGN KEY (`DniUsuario`) REFERENCES `Usuarios` (`Dni`)
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Jugadores_DniUsuario` ON `Jugadores` (`DniUsuario`);

CREATE INDEX `IX_Jugadores_IdEquipo` ON `Jugadores` (`IdEquipo`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531205939_RelacionEquipoJugador', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Jugadores` ADD `DniInvitado` int NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531212725_AddDniInvitadoJugador', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Partidos` DROP FOREIGN KEY `FK_Partidos_Canchas_IdCaching`;

ALTER TABLE `Partidos` MODIFY COLUMN `IdCaching` int NULL;

ALTER TABLE `Partidos` ADD CONSTRAINT `FK_Partidos_Canchas_IdCaching` FOREIGN KEY (`IdCaching`) REFERENCES `Canchas` (`IdCancha`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531223420_canchaNullable', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `RegistroTabla` ADD `PartidosEmpatados` int NOT NULL DEFAULT 0;

ALTER TABLE `RegistroTabla` ADD `PartidosGanados` int NOT NULL DEFAULT 0;

ALTER TABLE `RegistroTabla` ADD `PartidosJugados` int NOT NULL DEFAULT 0;

ALTER TABLE `RegistroTabla` ADD `PartidosPerdidos` int NOT NULL DEFAULT 0;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531224310_EstadisticasLiga', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE `Partidos` MODIFY COLUMN `GolesVisitante` int NULL;

ALTER TABLE `Partidos` MODIFY COLUMN `GolesLocal` int NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260531225736_GolesPartidos', '8.0.11');

COMMIT;

