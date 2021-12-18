/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a property
type SmartContract struct {
	contractapi.Contract
}

// Property describes basic details of what makes up a property
type Property struct {
	Property_id   string `json:"property_id"`
	Khasra_no  string `json:"khasra_no"`
	Property_khata   string `json:"property_khata"`
	Family_no  string `json:"family_no"`
	Tehsil  string `json:"tehsil"`
	District  string `json:"district"`
	Owner_id  string `json:"owner_id"`
	Owner_name  string `json:"owner_name"`
	Father_name  string `json:"father_name"`
	Stay bool `json:"stay"`
	Mortgage bool `json:"mortgage"`
	Leased bool `json:"leased"`
}
type User struct{
	Name string `json:"name"`
	Email string `json:"email"`
	CNIC string `json:"cnic"`
	Password string `json:"password"`
	IsAdmin bool `json:"isAdmin"`
	

}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"Key"`
	Record *Property
}

// InitLedger adds a base set of propertys to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	propertys := []Property{
		Property{Property_id: "2131247", Khasra_no: "76654", Property_khata:"74623", Family_no: "123", Tehsil: "Sialkot", District: "Sialkot", Owner_id: "34603-8958442-1", Owner_name: "Ammar Khalid", Father_name: "Khalid mehmood", Stay: false, Mortgage: false, Leased: false},
	}

	for i, property := range propertys {
		propertyAsBytes, _ := json.Marshal(property)
		err := ctx.GetStub().PutState("PROPERTY"+strconv.Itoa(i), propertyAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

// CreateProperty adds a new property to the world state with given details
func (s *SmartContract) CreateProperty(ctx contractapi.TransactionContextInterface, propertyNumber string, property_id string, khasra_no string, property_khata string, family_no string, tehsil string, district string, owner_id string, owner_name string, father_name string, stay bool, mortgage bool, leased bool) error {
	property := Property{
		Property_id: property_id,
		Khasra_no:  khasra_no,
		Property_khata: property_khata,
		Family_no:  family_no,
		Tehsil: tehsil,
		District: district,
		Owner_id: owner_id,
		Owner_name: owner_name,
		Father_name:father_name,
		Stay: stay,
		Mortgage: mortgage,
		Leased: leased,
	}

	propertyAsBytes, _ := json.Marshal(property)

	return ctx.GetStub().PutState(propertyNumber, propertyAsBytes)
}

func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, userid string, name string, email string, cnic string, password string, isAdmin bool) error {
	
	user := User{
	
		Name: name,
		Email: email,
		CNIC: cnic,
		Password: password,
		IsAdmin: isAdmin,
		
	}

	userAsBytes, _ := json.Marshal(user)

	return ctx.GetStub().PutState(userid, userAsBytes)
}

// QueryProperty returns the property stored in the world state with given id
func (s *SmartContract) QueryUser(ctx contractapi.TransactionContextInterface, Email string) (*User, error) {
	propertyAsBytes, err := ctx.GetStub().GetState(Email)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if propertyAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", Email)
	}

	user := new(User)
	_ = json.Unmarshal(propertyAsBytes, user)

	return user, nil
}

func (s *SmartContract) QueryProperty(ctx contractapi.TransactionContextInterface, propertyid string) (*Property, error) {
	propertyAsBytes, err := ctx.GetStub().GetState(propertyid)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if propertyAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", propertyid)
	}

	property := new(Property)
	_ = json.Unmarshal(propertyAsBytes, property)

	return property, nil
}

// QueryAllPropertys returns all propertys found in world state
func (s *SmartContract) QueryAllProperties(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		property := new(Property)
		_ = json.Unmarshal([]byte(queryResponse.Value), property)
		
		queryResult := QueryResult{Key: queryResponse.Key, Record: property}
		results = append(results, queryResult)}

	return results, nil
}
func (s *SmartContract) CheckUser(ctx contractapi.TransactionContextInterface, Email string, password string) bool {
	user, err := s.QueryUser(ctx, Email)

	if err != nil {
		return false
	}
	if user.Password == password {
	fmt.Printf("Successfull Login: %s",Email)
		return true
}

	return false
}
//Checks if the registered user is an admin or not
func (s *SmartContract) CheckUser1(ctx contractapi.TransactionContextInterface, Email string) bool {
	user, err := s.QueryUser(ctx, Email)

	if err != nil {
		return true
	}
	if user.IsAdmin == false {
	fmt.Printf("Successfull Login: %s",Email)
		return false
}

	return true
}
func (s *SmartContract) GetUserId(ctx contractapi.TransactionContextInterface, Email string) string {
	user, err := s.QueryUser(ctx, Email)

	if err != nil {
		return "false"
	}
	var x = user.CNIC
	return x
}
func (s *SmartContract) GetFard(ctx contractapi.TransactionContextInterface, property_id string, userid string) string {
	property, err := s.QueryProperty(ctx, property_id)

	if err != nil {
		return "false"
	}
	if property.Owner_id == userid {
	fmt.Printf("Successfull: %s",property_id)
		return property_id
}
	return "false"
}


func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabproperty chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabproperty chaincode: %s", err.Error())
	}
}
