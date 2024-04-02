package com.trsystem.elecAtrz.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ElecAtrzController {

	@PostMapping(value = "/boot/elecAtrz/insertElecAtrz")
	public int insertElecAtrz(@RequestBody Map<String, Object> params) {
		
		System.out.println(params);
		
		
		return 1;
	}
	
	
}
