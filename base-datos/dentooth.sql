-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Datos_dentooth
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Datos_dentooth
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Datos_dentooth` DEFAULT CHARACTER SET utf8 ;
USE `Datos_dentooth` ;

-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Paciente` (
  `idPaciente` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `Direccion` VARCHAR(45) NOT NULL,
  `Telefono` VARCHAR(15) NOT NULL,
  `Fecha de nacimiento` DATE NOT NULL,
  PRIMARY KEY (`idPaciente`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Asistente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Asistente` (
  `idAsistente` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `Direccion` VARCHAR(45) NOT NULL,
  `Telefono` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`idAsistente`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Odontologo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Odontologo` (
  `idOdontologo` INT NOT NULL,
  `Registro profesional` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `Direccion` VARCHAR(45) NOT NULL,
  `Telefono` VARCHAR(15) NOT NULL,
  `Epecialidad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idOdontologo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Historia clinica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Historia clinica` (
  `idHistoria clinica` INT NOT NULL,
  `Fecha` DATE NOT NULL,
  `Diagnostico` TEXT NOT NULL,
  `Antecedentes` TEXT NOT NULL,
  `Paciente_idPaciente` INT NOT NULL,
  PRIMARY KEY (`idHistoria clinica`),
  INDEX `fk_Historia clinica_Paciente1_idx` (`Paciente_idPaciente` ASC) VISIBLE,
  CONSTRAINT `fk_Historia clinica_Paciente1`
    FOREIGN KEY (`Paciente_idPaciente`)
    REFERENCES `Datos_dentooth`.`Paciente` (`idPaciente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Cita`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Cita` (
  `idCita` INT NOT NULL,
  `fecha` DATE NULL,
  `Hora inicio` TIME NULL,
  `Hora final` TIME NULL,
  `Estado` VARCHAR(45) NULL,
  `Asistente_idAsistente` INT NOT NULL,
  `Odontologo_idOdontologo` INT NOT NULL,
  `Paciente_idPaciente` INT NOT NULL,
  `Historia clinica_idHistoria clinica` INT NOT NULL,
  PRIMARY KEY (`idCita`),
  INDEX `fk_Cita_Asistente1_idx` (`Asistente_idAsistente` ASC) VISIBLE,
  INDEX `fk_Cita_Odontologo1_idx` (`Odontologo_idOdontologo` ASC) VISIBLE,
  INDEX `fk_Cita_Paciente1_idx` (`Paciente_idPaciente` ASC) VISIBLE,
  INDEX `fk_Cita_Historia clinica1_idx` (`Historia clinica_idHistoria clinica` ASC) VISIBLE,
  CONSTRAINT `fk_Cita_Asistente1`
    FOREIGN KEY (`Asistente_idAsistente`)
    REFERENCES `Datos_dentooth`.`Asistente` (`idAsistente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Cita_Odontologo1`
    FOREIGN KEY (`Odontologo_idOdontologo`)
    REFERENCES `Datos_dentooth`.`Odontologo` (`idOdontologo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Cita_Paciente1`
    FOREIGN KEY (`Paciente_idPaciente`)
    REFERENCES `Datos_dentooth`.`Paciente` (`idPaciente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Cita_Historia clinica1`
    FOREIGN KEY (`Historia clinica_idHistoria clinica`)
    REFERENCES `Datos_dentooth`.`Historia clinica` (`idHistoria clinica`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Factura` (
  `idFactura` INT NOT NULL,
  `Fecha` DATE NOT NULL,
  `Monto` INT NOT NULL,
  `Estado` VARCHAR(45) NOT NULL,
  `Cita_idCita` INT NOT NULL,
  PRIMARY KEY (`idFactura`),
  INDEX `fk_Factura_Cita1_idx` (`Cita_idCita` ASC) VISIBLE,
  CONSTRAINT `fk_Factura_Cita1`
    FOREIGN KEY (`Cita_idCita`)
    REFERENCES `Datos_dentooth`.`Cita` (`idCita`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Datos_dentooth`.`Tratamiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Datos_dentooth`.`Tratamiento` (
  `idTratamiento` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `costo` FLOAT NOT NULL,
  `Duracion` VARCHAR(45) NOT NULL,
  `Historia clinica_idHistoria clinica` INT NOT NULL,
  PRIMARY KEY (`idTratamiento`),
  INDEX `fk_Tratamiento_Historia clinica1_idx` (`Historia clinica_idHistoria clinica` ASC) VISIBLE,
  CONSTRAINT `fk_Tratamiento_Historia clinica1`
    FOREIGN KEY (`Historia clinica_idHistoria clinica`)
    REFERENCES `Datos_dentooth`.`Historia clinica` (`idHistoria clinica`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

CREATE TABLE IF NOT EXISTS `usuarios` (
    `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
    `correo` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `rol` VARCHAR(20) NOT NULL -- 'odontologo', 'asistente', 'paciente'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `odontologo` (
    `id_odontologo` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `especialidad` VARCHAR(50) NOT NULL,
    `id_usuario` INT NOT NULL, -- Llave foránea que conecta con la tabla usuarios
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `asistente` (
    `id_asistente` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(15) NOT NULL,
    `id_usuario` INT NOT NULL, -- Llave foránea que apunta al login en la tabla usuarios
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO usuarios ( correo, password, rol) 
VALUES ('carlos@dentooth.com', '123456', 'odontologo')
