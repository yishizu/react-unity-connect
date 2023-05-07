using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GeometryManager : MonoBehaviour
{
    [SerializeField] private GameObject boxPrefab;
    [SerializeField] private GameObject spherePrefab;
    [SerializeField] private GameObject cylinderPrefab;
    [SerializeField] private GameObject groundObject;
    
    private GameObject currentPrefab;
    private Camera mainCamera;
    public bool createMode = true;
    private int objectIdCounter = 0;
    private GameObject selectedObject = null;
    
    void Start()
    {
        mainCamera = Camera.main;
        currentPrefab = boxPrefab;
    }

    void Update()
    {
        if (createMode)
        {
            InstantiateGeometryAtClickPosition();
        }
        else
        {
            SelectObject();
        }
    }
    
    private void InstantiateGeometryAtClickPosition()
    {
        if (Input.GetMouseButtonDown(0) && currentPrefab != null)
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit))
            {
                if (hit.collider.gameObject == groundObject)
                {
                    Vector3 spawnPosition = hit.point;
                    GameObject instance = Instantiate(currentPrefab, spawnPosition, Quaternion.identity);
                    instance.name = "Geometry_" + ++objectIdCounter;
                }
            }
        }
    }
    private void SelectObject()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit))
            {
                if (!hit.collider.gameObject.CompareTag("Ground"))
                {
                    selectedObject = hit.collider.gameObject;
                    Debug.Log(selectedObject.name);
                }
            }
            else
            {
                selectedObject = null;
            }
        }
    }
    
    public void SetCreateMode(string value)
    {
        createMode = bool.Parse(value);
    }
    
    public void SetGeometryType(string geometryType)
    {
        

        switch (geometryType)
        {
            case "Box":
                currentPrefab = boxPrefab;
                break;
            case "Sphere":
                currentPrefab = spherePrefab;
                break;
            case "Cylinder":
                currentPrefab = cylinderPrefab;
                break;
            default:
                currentPrefab = boxPrefab;
                break;
                
        }
        
    }
    
    public void SetObjectScale( string x, string y, string z)
    {
        var newScale = new Vector3(int.Parse(x), int.Parse(y), int.Parse(z));
        if (selectedObject != null)
        {
            selectedObject.transform.localScale = newScale;
        }
    }
    
    public void ChangeObjectScale( string vector)
    {
        //var strings = vector.Split(",");
        //var newScale = new Vector3(int.Parse(strings[0]), int.Parse(strings[1]), int.Parse(strings[2]));
        if (selectedObject != null)
        {
            selectedObject.transform.localScale = new Vector3(2,2,2);
        }
    }

    public void SetObjectColor( string color)
    {
        //var newColor = new Color(float.Parse(r), float.Parse(g), float.Parse(b), float.Parse(a));
        if (selectedObject != null)
        {
            Renderer renderer = selectedObject.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = Color.red;
            }
        }
    }
    public void RotateObject()
    {
        if (selectedObject != null)
        {
            selectedObject.transform.Rotate(Vector3.up, 45f);
        }
    }

    public void DeleteObject(string objectId)
    {
       
        if (selectedObject != null)
        {
            Destroy(selectedObject);
        }
    }
    
    
    
}
