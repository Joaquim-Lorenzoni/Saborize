package br.edu.atitus.product_service.controllers;

import java.util.List;
import javax.security.sasl.AuthenticationException;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.edu.atitus.product_service.dtos.RestaurantDTO;
import br.edu.atitus.product_service.entities.RestaurantEntity;
import br.edu.atitus.product_service.repositories.RestaurantRepository;

@RestController
@RequestMapping("/ws/restaurants")
public class WsRestaurantController {

    private final RestaurantRepository repository;

    public WsRestaurantController(RestaurantRepository repository) {
        this.repository = repository;
    }


    @PostMapping
    public ResponseEntity<RestaurantEntity> createRestaurant(
            @RequestBody RestaurantDTO dto,
            @RequestHeader("X-User-Type") Integer userType) throws Exception {
        

        if (userType != 0) 
            throw new AuthenticationException("Usuário sem Permissão");


        RestaurantEntity entity = new RestaurantEntity();
        entity.setName(dto.name());
        repository.save(entity);

        return ResponseEntity.status(HttpStatus.CREATED).body(entity);
    }


    @GetMapping
    public ResponseEntity<List<RestaurantEntity>> getAllRestaurants(
            @RequestHeader("X-User-Type") Integer userType) throws Exception {
        

        if (userType != 0) 
            throw new AuthenticationException("Usuário sem Permissão");
        

        return ResponseEntity.ok(repository.findAll());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRestaurant(
            @PathVariable Long id,
            @RequestHeader("X-User-Type") Integer userType) throws Exception {
        

        if (userType != 0) 
            throw new AuthenticationException("Usuário sem Permissão");


        repository.deleteById(id);
        
        return ResponseEntity.ok("Restaurante deletado com sucesso.");
    }


    @ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handlerAuth(AuthenticationException e){
		String message = e.getMessage().replaceAll("[\\r\\n]", "");
		return ResponseEntity.status(403).body(message); 
	}
}