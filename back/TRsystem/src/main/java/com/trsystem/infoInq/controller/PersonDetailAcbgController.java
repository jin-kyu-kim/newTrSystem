package com.trsystem.infoInq.controller;

import com.trsystem.infoInq.service.PersonDetailAcbgService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PersonDetailAcbgController {

    private final PersonDetailAcbgService personDetailAcbgService;

    @GetMapping(value = "/boot/acbg")
    public List<Map<String, Object>> getAcbg() {
        return personDetailAcbgService.getDetailAcbg();
    }

    @GetMapping(value = "/boot/fggAblty")
    public List<Map<String, Object>> getFggAblty(@RequestParam("indvdlId") String indvdlId) {
        return personDetailAcbgService.getFggAblty(indvdlId);
    }

    @PostMapping(value = "/boot/deleteAcbg")
    public boolean deleteAcbg(@RequestBody Map<String, String> deleteParam) {
        if (deleteParam.get("acbgSn") == null || deleteParam.get("indvdlId")==null) {
            return false;
        } else {
            return personDetailAcbgService.deleteAcbg(deleteParam);
        }
    }

    @PostMapping(value = "/boot/saveAcbg")
    public boolean saveAcbg(@RequestBody Map<String, String> saveParam) {
        if (saveParam.get("acbgSn").isBlank()) {
            return personDetailAcbgService.insertAcbg(saveParam);
        } else {
            return personDetailAcbgService.updateAcbg(saveParam);
        }
    }
}
