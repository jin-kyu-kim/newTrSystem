package com.trsystem.infoInq.service;

import com.trsystem.infoInq.mapper.PersonDetailAcbgMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PersonDetailAcbgServiceImpl implements PersonDetailAcbgService{

    public final PersonDetailAcbgMapper personDetailAcbgMapper;

    public PersonDetailAcbgServiceImpl(PersonDetailAcbgMapper personDetailAcbgMapper) {
        this.personDetailAcbgMapper = personDetailAcbgMapper;
    }

    @Override
    public List<Map<String, Object>> getDetailAcbg() {
        return null;
    }

    @Override
    public List<Map<String, Object>> getFggAblty(String indvdlId) {
        return null;
    }

    @Override
    public boolean deleteAcbg(Map<String, String> deleteParam) {
        return false;
    }

    @Override
    public boolean insertAcbg(Map<String, String> insertParam) {
        return false;
    }

    @Override
    public boolean updateAcbg(Map<String, String> updateParam) {
        return false;
    }
}
