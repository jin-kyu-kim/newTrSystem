package com.trsystem;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@MapperScan(value = {"com.trsystem.**.mapper"})
@SpringBootApplication
public class TRsystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(TRsystemApplication.class, args);
    }

}
